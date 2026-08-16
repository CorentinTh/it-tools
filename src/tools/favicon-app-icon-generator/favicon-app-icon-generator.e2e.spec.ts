import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const sourcePng = readFileSync(new URL('../../../public/favicon-32x32.png', import.meta.url));

test.describe('Favicon and App Icon Generator', () => {
  test('generates bounded PNG outputs and a manifest from a local image', async ({ page }) => {
    await page.goto('/favicon-app-icon-generator');
    await expect(page.locator('.tool-header h1')).toHaveText('Favicon & App Icon Generator');
    await page.locator('input[type="file"]').setInputFiles({ name: 'private-logo.png', mimeType: 'image/png', buffer: sourcePng });
    await page.getByTestId('app-icon-generate').click();
    await expect(page.getByTestId('app-icon-status')).toContainText(/Generated|failed/);
    if (await page.getByTestId('app-icon-error').isVisible()) {
      throw new Error(await page.getByTestId('app-icon-error').innerText());
    }
    await expect(page.getByTestId('app-icon-status')).toContainText('Generated 7 PNG icons');
    await expect(page.getByTestId('app-icon-results').locator('img')).toHaveCount(7);
    await expect(page.getByTestId('app-icon-manifest')).toHaveValue(/maskable-icon-512\.png/);
  });
});
