import { expect, test } from '@playwright/test';

test.describe('Tool - MAC address generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mac-address-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('MAC address generator - IT Tools');
  });

  test('uses the shared accessible generator layout', async ({ page }) => {
    await expect(page.getByRole('spinbutton', { name: 'Quantity (1–100)' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'MAC address prefix' })).toBeVisible();
    await expect(page.getByRole('radiogroup', { name: 'Case' })).toBeVisible();
    await expect(page.getByRole('radiogroup', { name: 'Separator' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Generate' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy' })).toBeVisible();

    const optionsBox = await page.locator('.c-generator-options').boundingBox();
    const outputBox = await page.locator('.c-generator-output').boundingBox();
    expect(optionsBox).not.toBeNull();
    expect(outputBox).not.toBeNull();
    expect(Math.abs((optionsBox?.width ?? 0) - (outputBox?.width ?? 0))).toBeLessThanOrEqual(2);

    await page.setViewportSize({ width: 390, height: 844 });
    const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(hasHorizontalOverflow).toBe(false);
  });

  test('generates the requested quantity and blocks invalid prefixes', async ({ page }) => {
    await page.getByRole('spinbutton', { name: 'Quantity (1–100)' }).fill('2');
    await page.getByRole('button', { name: 'Generate' }).click();
    await expect(page.getByTestId('mac-address-output')).toHaveValue(/^[0-9A-F:]+\n[0-9A-F:]+$/);

    await page.getByRole('textbox', { name: 'MAC address prefix' }).fill('not-a-mac');
    await expect(page.getByRole('button', { name: 'Generate' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Copy' })).toBeDisabled();
  });
});
