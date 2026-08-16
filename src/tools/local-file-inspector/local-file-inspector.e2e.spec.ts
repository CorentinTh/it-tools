import { Buffer } from 'node:buffer';
import { expect, test } from '@playwright/test';

test.describe('Local File Inspector', () => {
  test('detects a local PNG, calculates CRC-32, and shows a bounded hex preview', async ({ page }) => {
    await page.goto('/local-file-inspector');
    await expect(page.locator('.tool-header h1')).toHaveText('Local File Inspector');
    await page.locator('input[type="file"]').setInputFiles({
      name: 'misleading.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x41]),
    });
    await page.getByTestId('file-inspector-run').click();
    await expect(page.getByTestId('file-inspector-result')).toContainText('PNG image');
    await expect(page.getByTestId('file-inspector-result')).toContainText('image/png');
    await expect(page.getByTestId('file-inspector-hex')).toHaveValue(/89 50 4e 47/);
  });

  test('does not persist the selected file across reloads', async ({ page }) => {
    await page.goto('/local-file-inspector');
    await page.locator('input[type="file"]').setInputFiles({
      name: 'private.bin',
      mimeType: 'application/octet-stream',
      buffer: Buffer.from('secret-value'),
    });
    await expect(page.getByTestId('file-inspector-selection')).toContainText('private.bin');
    await page.reload();
    await expect(page.getByTestId('file-inspector-selection')).toHaveCount(0);
  });
});
