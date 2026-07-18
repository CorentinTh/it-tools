import { type Page, expect, test } from '@playwright/test';

const ONE_MIB_IN_BYTES = 1024 * 1024;
const CONTENT_KEY = 'it-tools:v1:content:text-diff';
const PREFERENCE_KEY = 'it-tools:v1:preferences:text-diff:persist';
const DEFAULT_ORIGINAL_TEXT = 'original text';
const DEFAULT_MODIFIED_TEXT = 'modified text';
const ORIGINAL_MARKER = 'ORIGINAL-LARGE-DIFF-MARKER';
const MODIFIED_MARKER = 'MODIFIED-LARGE-DIFF-MARKER';
const FORBIDDEN_MONACO_WARNINGS = [
  /Could not create web worker/i,
  /Falling back to loading web worker code in main thread/i,
  /MonacoEnvironment\.getWorker(?:Url)?/i,
];

type EditorPane = 'original' | 'modified';

function createSharedFixtureBody(length: number) {
  const lines: string[] = [];
  let currentLength = 0;

  for (let lineNumber = 0; currentLength < length; lineNumber += 1) {
    const line = `line-${lineNumber.toString().padStart(6, '0')}: abcdefghijklmnopqrstuvwxyz0123456789\n`;
    lines.push(line);
    currentLength += line.length;
  }

  return lines.join('').slice(0, length);
}

function createLargeFixture(marker: string, length: number) {
  const header = `${marker}\n`;
  const body = createSharedFixtureBody(length - header.length);

  return `${header}${body}`;
}

async function editorInput(page: Page, pane: EditorPane) {
  const input = page.locator(`.monaco-diff-editor .editor.${pane} textarea.inputarea`).first();
  await expect(input).toHaveCount(1);

  return input;
}

async function platformCopyShortcut(page: Page) {
  return page.evaluate(() => navigator.platform.toLowerCase().includes('mac') ? 'Meta+C' : 'Control+C');
}

async function pasteEditorText(page: Page, pane: EditorPane, text: string) {
  const input = await editorInput(page, pane);
  await input.focus();
  // One clipboard event exercises Monaco's paste path without making the old
  // Playwright keyboard protocol serialise a megabyte as individual input.
  await input.evaluate((element, value) => {
    const clipboardData = new DataTransfer();
    clipboardData.setData('text/plain', value);
    element.dispatchEvent(new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      clipboardData,
    }));
  }, text);
}

async function readCurrentEditorLineThroughClipboard(page: Page, pane: EditorPane) {
  const input = await editorInput(page, pane);
  await input.focus();
  await page.keyboard.press(await platformCopyShortcut(page));

  return page.evaluate(async () => (await navigator.clipboard.readText()).replace(/\r\n/g, '\n'));
}

async function moveEditorCursorToStart(page: Page, pane: EditorPane) {
  const input = await editorInput(page, pane);
  await input.focus();
  // Browser-reported platform can differ from the host keyboard mapping in
  // Playwright's bundled Chromium. Both commands are start-of-document and
  // therefore idempotent on the platform that recognises them.
  await page.keyboard.press('Control+Home');
  await page.keyboard.press('Meta+ArrowUp');
}

test.use({ serviceWorkers: 'block' });

test.describe('Tool - Text Diff large input', () => {
  test('keeps two 1 MiB documents interactive, rendered, and ephemeral', async ({ browserName, context, page }, testInfo) => {
    test.skip(browserName !== 'chromium', 'The mandatory large-input baseline runs in Chromium.');
    test.setTimeout(2 * 60 * 1000);

    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    const runtimeErrors: string[] = [];
    page.on('pageerror', error => runtimeErrors.push(`pageerror: ${error.message}`));
    page.on('console', (message) => {
      const isForbiddenWarning = message.type() === 'warning'
        && FORBIDDEN_MONACO_WARNINGS.some(pattern => pattern.test(message.text()));

      if (message.type() === 'error' || isForbiddenWarning) {
        runtimeErrors.push(`console ${message.type()}: ${message.text()}`);
      }
    });

    expect(DEFAULT_ORIGINAL_TEXT).toHaveLength(DEFAULT_MODIFIED_TEXT.length);
    const pasteLength = ONE_MIB_IN_BYTES - DEFAULT_ORIGINAL_TEXT.length;
    const originalText = `${createLargeFixture(ORIGINAL_MARKER, pasteLength)}${DEFAULT_ORIGINAL_TEXT}`;
    const modifiedText = `${createLargeFixture(MODIFIED_MARKER, pasteLength)}${DEFAULT_MODIFIED_TEXT}`;
    expect(originalText).toHaveLength(ONE_MIB_IN_BYTES);
    expect(modifiedText).toHaveLength(ONE_MIB_IN_BYTES);

    await page.goto('/text-diff');
    await expect(page).toHaveTitle('Text diff - IT Tools');
    await expect(page.locator('.monaco-diff-editor')).toBeVisible();
    await expect(page.getByRole('switch')).not.toBeChecked();
    await expect.poll(() => page.workers().length).toBeGreaterThan(0);

    const interactionStartedAt = Date.now();
    await pasteEditorText(page, 'original', originalText.slice(0, -DEFAULT_ORIGINAL_TEXT.length));
    // Let Monaco apply the first model update before moving focus to the synced pane.
    await page.waitForTimeout(500);
    await pasteEditorText(page, 'modified', modifiedText.slice(0, -DEFAULT_MODIFIED_TEXT.length));

    const expectedOriginalLastLine = `${originalText.slice(originalText.lastIndexOf('\n') + 1)}\n`;
    const expectedModifiedLastLine = `${modifiedText.slice(modifiedText.lastIndexOf('\n') + 1)}\n`;
    expect(await readCurrentEditorLineThroughClipboard(page, 'original')).toBe(expectedOriginalLastLine);
    expect(await readCurrentEditorLineThroughClipboard(page, 'modified')).toBe(expectedModifiedLastLine);

    await moveEditorCursorToStart(page, 'original');
    expect(await readCurrentEditorLineThroughClipboard(page, 'original')).toBe(`${ORIGINAL_MARKER}\n`);
    await moveEditorCursorToStart(page, 'modified');
    expect(await readCurrentEditorLineThroughClipboard(page, 'modified')).toBe(`${MODIFIED_MARKER}\n`);

    await expect(page.locator('.editor.original .view-line').filter({ hasText: ORIGINAL_MARKER })).toBeVisible();
    await expect(page.locator('.editor.modified .view-line').filter({ hasText: MODIFIED_MARKER })).toBeVisible();

    await expect.poll(
      () => page.locator('.monaco-diff-editor .line-delete, .monaco-diff-editor .line-insert, .monaco-diff-editor .char-delete, .monaco-diff-editor .char-insert').count(),
      { timeout: 30_000 },
    ).toBeGreaterThan(0);
    const largeDiffReadyElapsedMs = Date.now() - interactionStartedAt;

    // Cross the persistence debounce window: large raw content must still stay ephemeral.
    await page.waitForTimeout(750);
    const storedTextDiffKeys = await page.evaluate(({ contentKey, preferenceKey }) => ({
      content: localStorage.getItem(contentKey),
      preference: localStorage.getItem(preferenceKey),
    }), { contentKey: CONTENT_KEY, preferenceKey: PREFERENCE_KEY });

    expect(storedTextDiffKeys).toEqual({ content: null, preference: null });

    const clearActionStartedAt = Date.now();
    await page.getByRole('button', { name: 'Clear saved text' }).click();
    await expect(page.getByRole('status')).toContainText('Saved Text Diff content was cleared');
    const clearActionElapsedMs = Date.now() - clearActionStartedAt;

    expect(runtimeErrors, runtimeErrors.join('\n')).toEqual([]);
    testInfo.annotations.push({
      type: 'large-text-interaction',
      description: [
        `bytes-per-side=${ONE_MIB_IN_BYTES}`,
        `diff-ready-ms=${largeDiffReadyElapsedMs}`,
        `clear-action-ms=${clearActionElapsedMs}`,
      ].join(' '),
    });
  });
});
