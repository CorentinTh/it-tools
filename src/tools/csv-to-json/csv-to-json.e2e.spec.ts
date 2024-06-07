import { expect, test } from '@playwright/test';

test.describe('Tool - CSV to JSON', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/csv-to-json');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('CSV to JSON - IT Tools');
  });

  test('Provided csv is converted to json', async ({ page }) => {
    await page.getByTestId('input').fill(`
Age,Salary,Gender,Country,Purchased
18,20000,Male,Germany,N
19,22000,Female,France,N
    `);

    const generatedJson = await page.getByTestId('area-content').innerText();

    expect(generatedJson.trim()).toEqual(`
[
  {"Age": "18", "Salary": "20000", "Gender": "Male", "Country": "Germany", "Purchased": "N"},
  {"Age": "19", "Salary": "22000", "Gender": "Female", "Country": "France", "Purchased": "N"}
]
   `.trim(),
    );
  });
});
