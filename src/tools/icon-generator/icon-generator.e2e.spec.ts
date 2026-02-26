import { Buffer } from 'node:buffer';
import { expect, test } from '@playwright/test';

const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
  <rect width="512" height="512" fill="#3b82f6"/>
  <circle cx="256" cy="256" r="140" fill="#f59e0b"/>
</svg>`;

test.describe('Tool - Icon generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/icon-generator');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Icon generator - IT Tools');
  });

  test('shows generator controls and default state', async ({ page }) => {
    await expect(page.getByText('Generate icons')).toBeVisible();
    await expect(page.getByText('Download zip')).toBeVisible();
    await expect(page.getByText('Selected output sizes: -')).toBeVisible();
    const manifestCheckbox = page.getByRole('checkbox', { name: 'Include manifest.json in ZIP' });
    await expect(manifestCheckbox).not.toBeChecked();

    await manifestCheckbox.click();
    await expect(manifestCheckbox).not.toBeChecked();
  });

  test('applies preset sizes and toggles manifest option with reset', async ({ page }) => {
    await page.getByRole('button', { name: 'PWA' }).click();
    await expect(page.getByText('Selected output sizes: 72, 96, 128, 144, 152, 192, 384, 512')).toBeVisible();

    const manifestCheckbox = page.getByRole('checkbox', { name: 'Include manifest.json in ZIP' });
    await manifestCheckbox.check();
    await expect(manifestCheckbox).toBeChecked();

    await page.getByRole('button', { name: 'Clear preset sizes' }).click();
    await expect(page.getByText('Selected output sizes: -')).toBeVisible();
    await expect(manifestCheckbox).not.toBeChecked();

    await manifestCheckbox.click();
    await expect(manifestCheckbox).not.toBeChecked();
  });

  test('generates icons and downloads zip', async ({ page }) => {
    await page.getByRole('button', { name: 'PWA' }).click();
    await page.locator('input[type="file"]').setInputFiles({
      name: 'source.svg',
      mimeType: 'image/svg+xml',
      buffer: Buffer.from(sampleSvg),
    });

    await page.getByRole('button', { name: 'Generate icons' }).click();
    await expect(page.getByText('Generated icons (8)')).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download zip' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('icon-icons.zip');
  });
});
