import { expect, test } from '@playwright/test';

test.describe('Tool - JSON to TS', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-to-ts');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('JSON to TS - IT Tools');
  });

  test('JSON is parsed and outputs clean TS', async ({ page }) => {
    await page.getByTestId('input').fill(`
{
   "foo": "bar",
   "list": {
      "name": "item",
      "another": {
         "key": "value"
      }
   }
}
    `.trim());

    const generatedJson = await page.getByTestId('area-content').innerText();

    expect(generatedJson.trim()).toEqual(
      `
      interface DataProps {
        foo: string;
        list: List;
      }
      
      interface List {
        name: string;
        another: Another;
      }
      
      interface Another {
        key: string;
      }
   `.trim(),
    );
  });
});
