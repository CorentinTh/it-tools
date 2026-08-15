import { expect, test } from '@playwright/test';

test.describe('Tool - IPv6 ULA generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ipv6-ula-generator');
  });

  test('uses labelled inputs, copy controls, and an explicit Generate action', async ({ page }) => {
    await expect(page).toHaveTitle('IPv6 ULA generator - IT Tools');
    await expect(page.getByRole('textbox', { name: 'MAC address' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'IPv6 ULA:' })).toHaveValue(/^fd[0-9a-f:]+::\/48$/);
    await expect(page.getByRole('textbox', { name: 'First routable block:' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Last routable block:' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy to clipboard' })).toHaveCount(3);
    await expect(page.getByRole('button', { name: 'Generate' })).toBeEnabled();

    await page.getByRole('textbox', { name: 'MAC address' }).fill('invalid');
    await expect(page.getByRole('button', { name: 'Generate' })).toBeDisabled();
    await expect(page.locator('.c-generator-output')).toHaveCount(0);
  });
});
