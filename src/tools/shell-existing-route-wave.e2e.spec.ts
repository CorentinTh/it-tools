import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

test.describe('Shell-conscious existing-route interoperability wave', () => {
  test('parses conventional integer notation while preserving base 37 case semantics', async ({ page }) => {
    await page.goto('/base-converter');
    await page.getByRole('spinbutton').first().fill('16');
    await page.getByLabel('Input number').fill('-0XFF');
    await expect(page.getByLabel('Decimal (10)')).toHaveValue('-255');

    await page.getByRole('spinbutton').first().fill('37');
    await page.getByLabel('Input number').fill('A');
    await expect(page.getByLabel('Decimal (10)')).toHaveValue('36');
    await page.getByLabel('Input number').fill('a');
    await expect(page.getByLabel('Decimal (10)')).toHaveValue('10');
  });

  test('restores harmless Home filters through deep links and browser history', async ({ page }) => {
    await page.goto('/?q=cidr&category=Network');
    const homeResults = page.locator('.grid-wrapper');
    await expect(page.getByLabel('Search tools')).toHaveValue('cidr');
    await expect(page.getByRole('combobox', { name: 'Category' })).toHaveText(/Network/);
    await expect(homeResults.getByRole('link', { name: /IPv6 Calculator/i })).toBeVisible();
    await expect(homeResults.getByRole('link', { name: /JSON Viewer/i })).toHaveCount(0);

    await page.getByRole('combobox', { name: 'Category' }).click();
    await page.getByRole('option', { name: 'Development', exact: true }).click();
    await expect(page).toHaveURL(/category=Development/);
    await expect(page.getByText('No tools match this filter.')).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL(/category=Network/);
    await expect(homeResults.getByRole('link', { name: /IPv6 Calculator/i })).toBeVisible();
  });

  test('drops unknown, repeated, and oversized Home query state', async ({ page }) => {
    await page.goto('/?q=first&q=second&category=Missing&secret=do-not-keep');
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByLabel('Search tools')).toHaveValue('');
    await expect(page.getByTestId('home-filter-status')).toContainText('133 tools shown');
  });

  test('downloads the complete already-computed converter output with a safe filename', async ({ page }) => {
    await page.goto('/json-to-yaml-converter');
    await page.getByTestId('input').fill('{"hello":"world"}');
    await page.getByTestId('converter-run').click();
    await expect(page.getByTestId('area-content')).toContainText('hello: world');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByTestId('converter-download').click(),
    ]);
    expect(download.suggestedFilename()).toBe('converted.yaml');
    const downloadPath = await download.path();
    expect(downloadPath).not.toBeNull();
    expect(await readFile(downloadPath!, 'utf8')).toBe('hello: world\n');
  });

  test('reorders favorites with named keyboard-accessible controls', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('favoriteToolsName', JSON.stringify(['/base-converter', '/json-prettify'])));
    await page.reload();
    const moveLater = page.getByRole('button', { name: 'Move Integer base converter later' });
    await moveLater.focus();
    await expect(moveLater).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(moveLater).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Move Integer base converter earlier' })).toBeFocused();
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('favoriteToolsName') ?? '[]')))
      .toEqual(['/json-prettify', '/base-converter']);
  });
});
