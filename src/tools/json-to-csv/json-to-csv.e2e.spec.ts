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

    const generatedJson = await page.getByTestId('area-content').innerText();

    expect(generatedJson.trim()).toEqual(`
Age,Salary,Gender,Country,Purchased
18,20000,Male,Germany,N
19,22000,Female,France,N
   `.trim(),
    );
  });
});
