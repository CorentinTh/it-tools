import { expect, test } from '@playwright/test';

test.describe('Tool - Yaml to json', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/yaml-to-json-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('YAML to JSON converter - IT Tools');
  });

  test('Yaml is parsed and output clean json', async ({ page }) => {
    await page.getByTestId('input').fill('foo: bar\nlist:\n  - item\n  - key: value');

    const generatedJson = await page.getByTestId('area-content').innerText();

    expect(generatedJson.trim()).toEqual(
      `
{
   "foo": "bar",
   "list": [
      "item",
      {
         "key": "value"
      }
   ]
}
   `.trim(),
    );
  });

  test('Yaml is parsed with merge key and output correct json', async ({ page }) => {
    await page.getByTestId('input').fill(`
      default: &default
        name: ''
        age: 0

      person:
        *default

      persons:
      - <<: *default
        age: 1
      - <<: *default
        name: John
      - { age: 3, <<: *default }
      
      `);

    const generatedJson = await page.getByTestId('area-content').innerText();

    expect(generatedJson.trim()).toEqual(
      `
{
   "default": {
      "name": "",
      "age": 0
   },
   "person": {
      "name": "",
      "age": 0
   },
   "persons": [
      {
         "name": "",
         "age": 1
      },
      {
         "name": "John",
         "age": 0
      },
      {
         "age": 3,
         "name": ""
      }
   ]
}`.trim(),
    );
  });
});
