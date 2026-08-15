import { expect, test } from '@playwright/test';

test.describe('Tool - XML formatter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/xml-formatter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('XML formatter - IT Tools');
  });

  test('XML is converted into a human readable format', async ({ page }) => {
    await page.getByTestId('input').fill('<foo><bar>baz</bar><bar>baz</bar></foo>');
    await expect(page.getByTestId('xml-format-status')).toContainText('completed');
    await expect(page.getByTestId('area-content')).toContainText('<bar>baz</bar>');
  });

  test('uses shared full-width formatter controls without mobile overflow', async ({ page }) => {
    await expect(page.getByRole('switch', { name: 'Collapse content' })).toBeVisible();
    await expect(page.getByRole('spinbutton', { name: 'Indent size (0–10)' })).toHaveAttribute('aria-valuenow', '2');

    await page.setViewportSize({ width: 390, height: 844 });
    const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(hasHorizontalOverflow).toBe(false);
  });
});
