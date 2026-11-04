import { type Page, expect, test } from '@playwright/test';

const SAMPLE_OUTPUT_FIRST_LINE = 'function greetUser(name: string) {';

function mockClipboard(page: Page, { fail }: { fail: boolean }) {
  return page.addInitScript((shouldFail) => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          if (shouldFail) {
            throw new DOMException('Write permission denied.', 'NotAllowedError');
          }
          (window as unknown as { copiedText: string }).copiedText = text;
        },
      },
    });
  }, fail);
}

function getOutputSelection(page: Page) {
  return page.getByTestId('output').evaluate((element: HTMLTextAreaElement) => ({
    start: element.selectionStart,
    end: element.selectionEnd,
    length: element.value.length,
  }));
}

test.describe('Tool - Whitespace cleaner', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/whitespace-cleaner');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Whitespace cleaner - Toolbox');
  });

  test('U1 updates the output on input with no button press', async ({ page }) => {
    await page.getByTestId('input').fill('  12 │ a\n  13 │ b   ');

    await expect(page.getByTestId('output')).toHaveValue('a\nb');
    await expect(page.getByTestId('output-badge')).toHaveText('2 lines · 3 chars · −85%');
  });

  test('U2 loads the sample and clears the input', async ({ page }) => {
    const clearButton = page.getByTestId('clear');
    await expect(clearButton).toHaveAttribute('aria-disabled', 'true');
    await expect(page.getByTestId('input-badge')).toHaveText('input');

    await page.getByTestId('sample').click();
    await expect(page.getByTestId('input')).toHaveValue(/● {2}function greetUser/);
    await expect(page.getByTestId('output')).toHaveValue(new RegExp(`^${SAMPLE_OUTPUT_FIRST_LINE.replace(/[()]/g, '\\$&')}`));
    await expect(page.getByTestId('input-badge')).toHaveText(/^8 lines · \d+ chars$/);
    await expect(clearButton).toHaveAttribute('aria-disabled', 'false');

    await clearButton.click();
    await expect(page.getByTestId('input')).toHaveValue('');
    await expect(page.getByTestId('output')).toHaveValue('');
    await expect(clearButton).toHaveAttribute('aria-disabled', 'true');
  });

  test('U3 shows "Copied ✓" for 1.5 s after a successful copy', async ({ page }) => {
    await mockClipboard(page, { fail: false });
    await page.reload();

    const copyButton = page.getByTestId('copy');
    await expect(copyButton).toHaveAttribute('aria-disabled', 'true');

    await page.getByTestId('sample').click();
    await expect(copyButton).toHaveAttribute('aria-disabled', 'false');
    await copyButton.click();

    await expect(copyButton).toHaveText('Copied ✓');
    await expect(page.getByTestId('copy-status')).toHaveText('Copied to the clipboard.');
    expect(await page.evaluate(() => (window as unknown as { copiedText: string }).copiedText)).toMatch(new RegExp(`^${SAMPLE_OUTPUT_FIRST_LINE.replace(/[()]/g, '\\$&')}`));
    await expect(copyButton).toHaveText('Copy', { timeout: 3000 });
  });

  test('U3 shows an error state and selects the output when the clipboard is denied', async ({ page }) => {
    await mockClipboard(page, { fail: true });
    await page.reload();

    await page.getByTestId('sample').click();
    await page.getByTestId('copy').click();

    await expect(page.getByTestId('copy')).toHaveText('Copy failed');
    await expect(page.getByTestId('copy-status')).toHaveText(/Copy failed/);
    await expect(page.getByTestId('output')).toBeFocused();

    const selection = await getOutputSelection(page);
    expect(selection).toEqual({ start: 0, end: selection.length, length: selection.length });
    expect(selection.length).toBeGreaterThan(0);
  });

  test('U4 selects all output on focus and on click with no selection', async ({ page }) => {
    await page.getByTestId('sample').click();
    const output = page.getByTestId('output');
    await expect(output).not.toHaveValue('');

    await output.focus();
    let selection = await getOutputSelection(page);
    expect(selection).toEqual({ start: 0, end: selection.length, length: selection.length });

    await output.evaluate((element: HTMLTextAreaElement) => element.setSelectionRange(3, 3));
    await output.click();
    selection = await getOutputSelection(page);
    expect(selection).toEqual({ start: 0, end: selection.length, length: selection.length });

    await output.evaluate((element: HTMLTextAreaElement) => element.setSelectionRange(3, 3));
    await output.blur();
    await output.click();
    selection = await getOutputSelection(page);
    expect(selection).toEqual({ start: 0, end: selection.length, length: selection.length });
  });

  test('U4 keeps a partial drag selection', async ({ page }) => {
    await page.getByTestId('sample').click();
    const output = page.getByTestId('output');
    await expect(output).not.toHaveValue('');
    await expect(output).not.toBeFocused();

    const box = await output.boundingBox();
    if (!box) {
      throw new Error('The output has no bounding box.');
    }

    async function dragAcrossFirstLine() {
      await page.mouse.move(box!.x + 20, box!.y + 12);
      await page.mouse.down();
      await page.mouse.move(box!.x + 80, box!.y + 12, { steps: 5 });
      await page.mouse.up();

      const selection = await getOutputSelection(page);
      expect(selection.end - selection.start).toBeGreaterThan(0);
      expect(selection.end - selection.start).toBeLessThan(selection.length);
    }

    await dragAcrossFirstLine();

    // A click selects all. A drag that starts inside that selection still selects part of the output.
    await output.click();
    const selection = await getOutputSelection(page);
    expect(selection).toEqual({ start: 0, end: selection.length, length: selection.length });

    await dragAcrossFirstLine();
  });

  test('U4 keeps the scroll position when a click selects all', async ({ page }) => {
    await page.getByTestId('input').fill(Array.from({ length: 200 }, (_, index) => `line ${index}`).join('\n'));
    const output = page.getByTestId('output');
    await expect(output).toHaveValue(/line 199$/);

    // Waiting two frames lets a scroll that the browser applies after a selection change take effect.
    const waitForFrames = () => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));

    await output.click();
    await waitForFrames();
    await output.evaluate((element: HTMLTextAreaElement) => {
      element.scrollTop = 1000;
    });

    // The press collapses the full selection, and the click selects all again.
    const box = await output.boundingBox();
    await page.mouse.move(box!.x + 20, box!.y + 40);
    await page.mouse.down();
    await page.mouse.up();
    await waitForFrames();

    const selection = await getOutputSelection(page);
    expect(selection).toEqual({ start: 0, end: selection.length, length: selection.length });
    expect(await output.evaluate((element: HTMLTextAreaElement) => element.scrollTop)).toBe(1000);
  });

  test('U5 shows the hint only while the output has content', async ({ page }) => {
    await expect(page.getByTestId('output-hint')).toHaveCount(0);

    await page.getByTestId('sample').click();
    await expect(page.getByTestId('output-hint')).toHaveText('⌘/Ctrl+A · Ctrl+C');
  });

  test('U6 toggles an option chip', async ({ page }) => {
    await page.getByTestId('input').fill('●  foo');
    await expect(page.getByTestId('output')).toHaveValue('foo');

    const chip = page.getByTestId('option-stripBulletMarkers');
    await expect(chip).toHaveAttribute('aria-pressed', 'true');

    await chip.click();
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByTestId('output')).toHaveValue('●  foo');
  });

  test('U7 stacks the panes with no horizontal scroll on a narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.getByTestId('sample').click();

    const inputBox = await page.getByTestId('input').boundingBox();
    const outputBox = await page.getByTestId('output').boundingBox();
    expect(inputBox && outputBox && outputBox.y > inputBox.y + inputBox.height).toBe(true);

    const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(hasHorizontalScroll).toBe(false);
  });

  test('OS4 keeps the options and drops the input across reloads', async ({ page }) => {
    await page.getByTestId('input').fill('some text');
    await page.getByTestId('option-markdownMode').click();
    await expect(page.getByTestId('option-markdownMode')).toHaveAttribute('aria-pressed', 'true');

    await page.reload();

    await expect(page.getByTestId('option-markdownMode')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('input')).toHaveValue('');
  });
});
