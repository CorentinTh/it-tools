import { expect, test } from '@playwright/test';

const ULID_REGEX = /[0-9A-Z]{26}/;

test.describe('Tool - ULID generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ulid-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('ULID generator - IT Tools');
  });

  test('the primary Generate action creates a new ulid', async ({ page }) => {
    const ulid = await page.getByTestId('ulids').inputValue();
    expect(ulid?.trim()).toMatch(ULID_REGEX);

    await page.getByTestId('refresh').click();
    const newUlid = await page.getByTestId('ulids').inputValue();
    expect(ulid?.trim()).not.toBe(newUlid?.trim());
    expect(newUlid?.trim()).toMatch(ULID_REGEX);
  });
});
