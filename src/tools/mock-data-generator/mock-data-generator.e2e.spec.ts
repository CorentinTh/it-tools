import { expect, test } from '@playwright/test';

test.describe('Tool - Mock data generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mock-data-generator');
  });

  test('loads and replays deterministic local JSON', async ({ page }) => {
    await expect(page).toHaveTitle('Mock data generator - IT Tools');
    await page.getByTestId('mock-data-count').fill('3');
    await page.getByTestId('mock-data-generate').click();
    await expect(page.getByTestId('mock-data-status')).toContainText('Generated 3 records');
    const first = await page.getByTestId('mock-data-output').inputValue();
    expect(JSON.parse(first)).toHaveLength(3);

    await page.getByTestId('mock-data-generate').click();
    await expect(page.getByTestId('mock-data-output')).toHaveValue(first);
  });

  test('keeps generated fixtures ephemeral and downloadable', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', request => requests.push(`${request.url()} ${request.postData() ?? ''}`));
    await page.getByTestId('mock-data-seed').fill('private-fixture-seed');
    await page.getByTestId('mock-data-generate').click();
    await expect(page.getByTestId('mock-data-status')).toContainText('Generated');
    const output = await page.getByTestId('mock-data-output').inputValue();

    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('mock-data-download').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('mock-data.json');
    expect(requests.every(request => !request.includes('private-fixture-seed'))).toBe(true);
    expect(await page.evaluate(() => Object.values(localStorage).every(value => !value.includes('private-fixture-seed')))).toBe(true);
    expect(page.url()).not.toContain('private-fixture-seed');
    expect(output).toContain('firstName');
  });
});
