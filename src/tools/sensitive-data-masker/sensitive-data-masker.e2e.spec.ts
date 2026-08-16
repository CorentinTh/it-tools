import { expect, test } from '@playwright/test';

test.describe('Tool - Sensitive data masker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sensitive-data-masker');
  });

  test('sanitizes JSON locally and keeps output stale until the next explicit run', async ({ page }) => {
    await expect(page).toHaveTitle('Sensitive data masker - IT Tools');
    await page.getByTestId('sanitizer-run').click();
    await expect(page.getByTestId('sanitizer-status')).toContainText('completed');
    const output = await page.getByTestId('sanitizer-output').inputValue();
    expect(output).toContain('[REDACTED]');
    expect(output).not.toContain('correct-horse-battery-staple');
    expect(output).not.toContain('ada@example.test');

    await page.getByTestId('sanitizer-input').fill('{"password":"next-secret"}');
    await expect(page.getByTestId('sanitizer-stale')).toBeVisible();
    await expect(page.getByTestId('sanitizer-output')).toHaveValue(output);
  });

  test('does not persist or transmit sensitive source content', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', request => requests.push(`${request.url()} ${request.postData() ?? ''}`));
    await page.getByTestId('sanitizer-input').fill('password=nightly-private-value');
    await page.getByTestId('sanitizer-run').click();
    await expect(page.getByTestId('sanitizer-output')).toHaveValue('password=[REDACTED]');
    expect(requests.every(request => !request.includes('nightly-private-value'))).toBe(true);
    expect(await page.evaluate(() => Object.values(localStorage).every(value => !value.includes('nightly-private-value')))).toBe(true);
    expect(page.url()).not.toContain('nightly-private-value');
  });
});
