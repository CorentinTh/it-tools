import { expect, test } from '@playwright/test';

test.describe('Tool - json to yaml', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-to-yaml-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('JSON to YAML converter - IT Tools');
  });

  test('json is parsed and output clean yaml', async ({ page }) => {
    await page.getByTestId('input').fill('{"foo":"bar","list":["item",{"key":"value"}]}');

    const generatedJson = await page.getByTestId('area-content').innerText();

    expect(generatedJson.trim()).toEqual('foo: bar\nlist:\n  - item\n  - key: value'.trim());
  });
});
