import { expect, test } from '@playwright/test';

test.describe('Tool - X509 certificate decoder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/x509-certificate-decoder');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('X509 certificate decoder - Tech Tools');
  });
});
