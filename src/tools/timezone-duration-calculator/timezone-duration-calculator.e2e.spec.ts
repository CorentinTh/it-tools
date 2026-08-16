import { expect, test } from '@playwright/test';

test.describe('Tool - Timezone and duration calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/timezone-duration-calculator');
  });

  test('converts a local instant between timezones', async ({ page }) => {
    await expect(page).toHaveTitle('Timezone and date duration calculator - IT Tools');
    await expect(page.getByTestId('timezone-result')).toContainText('2026-01-15 12:00:00');
    await expect(page.getByTestId('timezone-result')).toContainText('2026-01-15 04:00:00');
  });

  test('calculates elapsed duration across zones after an explicit action', async ({ page }) => {
    await page.getByRole('radio', { name: 'Date duration' }).click();
    await expect(page.getByTestId('timezone-stale')).toBeVisible();
    await page.getByTestId('timezone-calculate').click();
    await expect(page.getByTestId('duration-iso')).toHaveText('P1DT11H30M0S');
  });

  test('rejects a nonexistent DST wall time while preserving previous results', async ({ page }) => {
    const previous = await page.getByTestId('timezone-result').textContent();
    await page.getByTestId('timezone-start-local').fill('2024-03-10T02:30:00');
    // Selects are keyboard accessible and searchable; use the exposed combobox label.
    const timezone = page.getByRole('combobox', { name: 'Timezone' }).first();
    await timezone.click();
    await page.getByPlaceholder('Search...').fill('America/New_York');
    await page.getByRole('option', { name: 'America/New_York' }).click();
    await page.getByTestId('timezone-calculate').click();
    await expect(page.getByTestId('timezone-error')).toContainText('does not exist');
    await expect(page.getByTestId('timezone-result')).toHaveText(previous ?? '');
  });
});
