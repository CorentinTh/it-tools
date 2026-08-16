import { expect, test } from '@playwright/test';

test.describe('Tool - Cron expression and next runs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/crontab-generator');
  });

  test('calculates deterministic Unix next runs in UTC', async ({ page }) => {
    await expect(page).toHaveTitle('Crontab generator - IT Tools');
    await page.getByTestId('cron-expression').fill('*/15 * * * *');
    await page.getByTestId('cron-after').fill('2026-01-01T00:07:00.000Z');
    await page.getByTestId('cron-count').fill('3');
    await page.getByTestId('cron-calculate').click();
    await expect(page.getByTestId('cron-status')).toContainText('calculated');
    await expect(page.getByTestId('cron-output')).toHaveValue(/2026-01-01 00:15:00/);
    await expect(page.getByTestId('cron-output')).toHaveValue(/2026-01-01 00:45:00/);
  });

  test('switches dialect presets and rejects unsupported Quartz modifiers', async ({ page }) => {
    await page.getByRole('radio', { name: 'Quartz (6/7 fields)' }).click();
    await expect(page.getByTestId('cron-expression')).toHaveValue('0 0 9 ? * MON-FRI');
    await page.getByTestId('cron-expression').fill('0 0 9 ? * MON#2');
    await expect(page.getByTestId('cron-validation')).toContainText('not supported');
    await expect(page.getByTestId('cron-calculate')).toBeDisabled();
  });
});
