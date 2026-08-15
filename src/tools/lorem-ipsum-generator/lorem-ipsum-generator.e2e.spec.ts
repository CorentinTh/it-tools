import { expect, test } from '@playwright/test';

test.describe('Tool - Lorem ipsum generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lorem-ipsum-generator');
  });

  test('uses accessible sliders, switches, output, and actions', async ({ page }) => {
    await expect(page).toHaveTitle('Lorem ipsum generator - IT Tools');
    await expect(page.getByRole('slider', { name: 'Paragraphs (1)' })).toHaveAttribute('aria-valuenow', '1');
    await expect(page.getByRole('slider', { name: /Sentences per paragraph/ })).toHaveCount(2);
    await expect(page.getByRole('slider', { name: /Words per sentence/ })).toHaveCount(2);
    await expect(page.getByRole('switch', { name: 'Start with Lorem ipsum' })).toBeChecked();
    await expect(page.getByRole('switch', { name: 'Generate HTML' })).not.toBeChecked();
    await expect(page.getByRole('button', { name: 'Generate' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy' })).toBeVisible();

    await page.getByRole('switch', { name: 'Generate HTML' }).click();
    await expect(page.getByTestId('lorem-output')).toHaveValue(/^<p>/);
  });

  test('keeps equal-width blocks without mobile overflow', async ({ page }) => {
    const optionsBox = await page.locator('.c-generator-options').boundingBox();
    const outputBox = await page.locator('.c-generator-output').boundingBox();
    expect(optionsBox).not.toBeNull();
    expect(outputBox).not.toBeNull();
    expect(Math.abs((optionsBox?.width ?? 0) - (outputBox?.width ?? 0))).toBeLessThanOrEqual(2);

    await page.setViewportSize({ width: 390, height: 844 });
    const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(hasHorizontalOverflow).toBe(false);
  });
});
