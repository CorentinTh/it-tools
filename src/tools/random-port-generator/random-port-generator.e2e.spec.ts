import { expect, test } from '@playwright/test';

test.describe('Tool - Random port generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/random-port-generator');
  });

  test('uses the shared result and action contract', async ({ page }) => {
    await expect(page).toHaveTitle('Random port generator - IT Tools');

    const output = page.getByRole('textbox', { name: 'Generated port' });
    await expect(output).toHaveValue(/^\d{4,5}$/);
    await expect(page.getByRole('button', { name: 'Generate' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy' })).toBeVisible();

    const previousPort = await output.inputValue();
    await page.getByRole('button', { name: 'Generate' }).click();
    await expect(output).not.toHaveValue(previousPort);
  });
});
