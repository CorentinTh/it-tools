import { expect, test } from '@playwright/test';

test.describe('Tool - TOML to YAML', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/toml-to-yaml');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('TOML to YAML - IT Tools');
  });

  test('TOML is parsed and outputs clean YAML', async ({ page }) => {
    await page.getByTestId('input').fill(`
foo = "bar"

# This is a comment

[list]
  name = "item"
[list.another]
  key = "value"
    `.trim());

    const generatedJson = await page.getByTestId('area-content').innerText();

    expect(generatedJson.trim()).toEqual(
      `
foo: bar
list:
  name: item
  another:
    key: value
   `.trim(),
    );
  });
});
