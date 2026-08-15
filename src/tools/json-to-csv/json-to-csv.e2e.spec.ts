import { expect, test } from '@playwright/test';

test.describe('Tool - JSON to CSV', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-to-csv');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('JSON to CSV - IT Tools');
  });

  test('Provided json is converted to csv', async ({ page }) => {
    await page.getByTestId('input').fill(`
[
  {'Age': 18.0, 'Salary': 20000.0, 'Gender': 'Male', 'Country': 'Germany', 'Purchased': 'N'},
  {'Age': 19.0, 'Salary': 22000.0, 'Gender': 'Female', 'Country': 'France', 'Purchased': 'N'},
]
    `);

    await expect(page.getByTestId('json-to-csv-status')).toContainText('completed');
    await expect(page.getByTestId('area-content')).toHaveText(`
Age,Salary,Gender,Country,Purchased
18,20000,Male,Germany,N
19,22000,Female,France,N
   `.trim());
  });

  test('large input waits for an explicit run and does not persist or transmit it', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', request => requests.push(request.url()));
    const source = JSON.stringify(Array.from({ length: 4_000 }, (_, index) => ({ id: index, value: 'private'.repeat(4) })));

    await page.getByTestId('input').fill(source);
    await expect(page.getByTestId('json-to-csv-status')).toContainText('only on request');
    await page.getByTestId('json-to-csv-run').click();
    await expect(page.getByTestId('json-to-csv-status')).toContainText('completed');
    expect(requests.some(url => url.includes('private'))).toBe(false);
    expect(await page.evaluate(() => Object.values(localStorage).some(value => value.includes('private')))).toBe(false);
  });
});
