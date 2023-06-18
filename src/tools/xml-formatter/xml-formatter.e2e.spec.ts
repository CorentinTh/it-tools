import { expect, test } from '@playwright/test';

test.describe('Tool - XML formatter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/xml-formatter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('XML formatter - IT Tools');
  });

  test('XML is converted into a human readable format', async ({ page }) => {
    await page.getByTestId('input').fill('<foo><bar>baz</bar><bar>baz</bar></foo>');

    const formattedXml = await page.getByTestId('area-content').innerText();

    expect(formattedXml.trim()).toEqual(`
<foo>
  <bar>baz</bar>
  <bar>baz</bar>
</foo>`.trim());
  });
});
