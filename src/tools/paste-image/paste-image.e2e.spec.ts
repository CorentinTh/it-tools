import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

declare global {
  interface Window {
    createTestPng: () => Promise<Blob>
    dispatchTestPaste: (items: { kind: string; type: string; getAsFile: () => File | null }[]) => void
  }
}

const noImageWarning = 'The clipboard has no image. Copy an image, then try again.';

// Browsers differ in how they let scripts build a ClipboardEvent with clipboardData.
// The helpers attach the clipboard data to a plain event, which works in every browser engine.
async function installTestHelpers(page: Page) {
  await page.addInitScript(() => {
    window.createTestPng = async () => {
      // A 2x1 PNG with one red and one transparent pixel.
      const canvas = document.createElement('canvas');
      canvas.width = 2;
      canvas.height = 1;
      const context = canvas.getContext('2d')!;
      context.fillStyle = '#ff0000';
      context.fillRect(0, 0, 1, 1);

      return new Promise<Blob>(resolve => canvas.toBlob(blob => resolve(blob!), 'image/png'));
    };

    window.dispatchTestPaste = (items) => {
      const event = new Event('paste', { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'clipboardData', { value: { items } });
      (document.activeElement ?? document).dispatchEvent(event);
    };
  });
}

// The router loads the tool lazily, so the page "load" event can fire before the tool listens for paste events.
// The tool registers its paste listener before it renders, so a visible tool button means pastes are handled.
async function waitForTool(page: Page) {
  await expect(page.getByTestId('paste-from-clipboard')).toBeVisible();
}

async function pasteImage(page: Page) {
  await page.evaluate(async () => {
    const file = new File([await window.createTestPng()], 'image.png', { type: 'image/png' });
    window.dispatchTestPaste([{ kind: 'file', type: 'image/png', getAsFile: () => file }]);
  });
}

async function pasteText(page: Page) {
  await page.evaluate(() => window.dispatchTestPaste([{ kind: 'string', type: 'text/plain', getAsFile: () => null }]));
}

test.describe('Tool - Paste image', () => {
  test.beforeEach(async ({ page }) => {
    await installTestHelpers(page);
    await page.goto('/paste-image');
    await waitForTool(page);
  });

  test('Has title', async ({ page }) => {
    await expect(page).toHaveTitle('Paste image - Toolbox');
  });

  test('A pasted image is added to the history and can be downloaded', async ({ page }) => {
    await pasteImage(page);
    await pasteImage(page);

    await expect(page.getByTestId('pasted-image')).toHaveCount(2);
    await expect(page.getByTestId('output-info').first()).toContainText('Output: PNG');

    const fileNames = await page.getByTestId('file-name').evaluateAll(inputs => inputs.map(input => (input as HTMLInputElement).value));
    expect(new Set(fileNames).size).toBe(2);

    await page.getByTestId('file-name').first().fill('my-screenshot');

    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('download').first().click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('my-screenshot.png');
  });

  test('The selected format converts the pasted image', async ({ page }) => {
    await pasteImage(page);
    await page.getByRole('button', { name: 'JPEG' }).click();

    await expect(page.getByTestId('output-info')).toContainText('Output: JPEG');

    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('download').click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/^pasted-image-\d{8}-\d{6}\.jpg$/);
  });

  test('The quality slider is shown only for lossy formats', async ({ page }) => {
    await expect(page.getByText('Quality:')).toBeHidden();

    await page.getByRole('button', { name: 'WebP' }).click();
    await expect(page.getByText('Quality:')).toBeVisible();

    await page.getByRole('button', { name: 'PNG' }).click();
    await expect(page.getByText('Quality:')).toBeHidden();
  });

  test('An invalid stored format falls back to PNG', async ({ page }) => {
    await page.evaluate(() => localStorage.setItem('paste-image:format', 'gif'));
    await page.reload();
    await waitForTool(page);

    await pasteImage(page);

    await expect(page.getByTestId('output-info')).toContainText('Output: PNG');
  });

  test('Images can be removed one by one or all at once', async ({ page }) => {
    await pasteImage(page);
    await pasteImage(page);
    await pasteImage(page);
    await expect(page.getByTestId('pasted-image')).toHaveCount(3);

    await page.getByRole('button', { name: 'Remove' }).first().click();
    await expect(page.getByTestId('pasted-image')).toHaveCount(2);

    await page.getByRole('button', { name: 'Clear all' }).click();
    await expect(page.getByTestId('pasted-image')).toHaveCount(0);
  });

  test('Pasting text warns only outside text fields', async ({ page }) => {
    await pasteImage(page);
    await page.getByTestId('file-name').focus();
    await pasteText(page);

    await page.getByTestId('file-name').blur();
    await pasteText(page);

    // Only the paste outside the file name field shows the warning.
    await expect(page.getByText(noImageWarning)).toHaveCount(1);
  });

  test('The paste from clipboard button adds the clipboard image', async ({ page }) => {
    await page.evaluate(async () => {
      const png = await window.createTestPng();
      Object.defineProperty(navigator.clipboard, 'read', {
        configurable: true,
        value: async () => [{ types: ['text/plain', 'image/png'], getType: async () => png }],
      });
    });

    await page.getByTestId('paste-from-clipboard').click();

    await expect(page.getByTestId('pasted-image')).toHaveCount(1);
  });

  test('The paste from clipboard button warns when the clipboard has no image', async ({ page }) => {
    await page.evaluate(() => {
      Object.defineProperty(navigator.clipboard, 'read', {
        configurable: true,
        value: async () => [{ types: ['text/plain'], getType: async () => new Blob(['text']) }],
      });
    });

    await page.getByTestId('paste-from-clipboard').click();

    await expect(page.getByText(noImageWarning)).toBeVisible();
    await expect(page.getByTestId('pasted-image')).toHaveCount(0);
  });
});
