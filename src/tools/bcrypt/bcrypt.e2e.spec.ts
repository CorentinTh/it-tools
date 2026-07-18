import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

test.describe('Tool - Bcrypt', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bcrypt');
  });

  test('hashes and compares only after an explicit action', async ({ page }) => {
    await expect(page).toHaveTitle('Bcrypt - IT Tools');
    await page.getByTestId('bcrypt-input').fill('secret');
    await page.getByPlaceholder('Salt rounds...').fill('4');

    await expect(page.getByTestId('bcrypt-hash-output')).toHaveValue('');
    await page.getByTestId('bcrypt-hash-run').click();
    await expect(page.getByTestId('bcrypt-hash-output')).toHaveValue(/^\$2[aby]\$04\$.{53}$/);
    await expect(page.getByTestId('bcrypt-hash-status')).toContainText('completed');

    const generatedHash = await page.getByTestId('bcrypt-hash-output').inputValue();
    await page.getByTestId('bcrypt-compare-input').fill('secret');
    await page.getByTestId('bcrypt-compare-hash').fill(generatedHash);
    await page.getByTestId('bcrypt-compare-run').click();
    await expect(page.getByTestId('bcrypt-compare-result')).toHaveText('Yes');

    await page.getByTestId('bcrypt-compare-input').fill('different');
    await expect(page.getByTestId('bcrypt-compare-result')).toHaveCount(0);
    await page.getByTestId('bcrypt-compare-run').click();
    await expect(page.getByTestId('bcrypt-compare-result')).toHaveText('No');
  });

  test('reports empty rounds and malformed hashes without crashing the tool', async ({ page }) => {
    await page.getByPlaceholder('Salt rounds...').fill('');
    await page.getByTestId('bcrypt-hash-run').click();
    await expect(page.getByTestId('bcrypt-hash-status')).toContainText('whole number');

    await page.getByTestId('bcrypt-compare-input').fill('secret');
    await page.getByTestId('bcrypt-compare-hash').fill('not-a-bcrypt-hash');
    await page.getByTestId('bcrypt-compare-run').click();

    await expect(page.getByTestId('bcrypt-compare-status')).toContainText('valid 60-character bcrypt hash');
    await expect(page.locator('.tool-header h1')).toBeVisible();
    await expect(page.getByTestId('bcrypt-compare-result')).toHaveCount(0);
  });

  test('terminates work when input changes and ignores stale results', async ({ page }) => {
    await page.getByTestId('bcrypt-input').fill('first secret');
    await page.getByPlaceholder('Salt rounds...').fill('14');
    await page.getByTestId('bcrypt-hash-run').click();
    await expect(page.getByTestId('bcrypt-hash-cancel')).toBeVisible();

    await page.getByTestId('bcrypt-input').fill('replacement');
    await expect(page.getByTestId('bcrypt-hash-status')).toContainText('input changed');
    await expect(page.getByTestId('bcrypt-hash-output')).toHaveValue('');
    await page.waitForTimeout(1_500);
    await expect(page.getByTestId('bcrypt-hash-output')).toHaveValue('');
  });

  test('allows an in-flight operation to be cancelled explicitly', async ({ page }) => {
    await page.getByTestId('bcrypt-input').fill('secret');
    await page.getByPlaceholder('Salt rounds...').fill('14');
    await page.getByTestId('bcrypt-hash-run').click();
    await page.getByTestId('bcrypt-hash-cancel').click();

    await expect(page.getByTestId('bcrypt-hash-status')).toHaveText('Hashing cancelled.');
    await expect(page.getByTestId('bcrypt-hash-output')).toHaveValue('');
  });
});
