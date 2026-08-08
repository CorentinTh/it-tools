import { expect, test } from '@playwright/test';

test.describe('Tool - XML diff', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/xml-diff');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('XML diff - IT Tools');
  });

  test('Identical XMLs have a custom result message', async ({ page }) => {
    await page.getByTestId('leftXml').fill('<foo><bar>baz</bar></foo>');
    await page.getByTestId('rightXml').fill('<foo>\n  <bar>baz</bar>\n</foo>');

    const result = await page.getByTestId('diff-result').innerText();

    expect(result).toContain('The provided XMLs are the same');
  });

  test('Different XMLs have differences listed', async ({ page }) => {
    await page.getByTestId('leftXml').fill('<root foo="bar"/>');
    await page.getByTestId('rightXml').fill('<root foo="buz" baz="qux"/>');

    const result = await page.getByTestId('diff-result').innerText();

    expect(result).toContain('{\n@foo: "bar""buz",\n@baz: "qux",\n},');
  });

  test('Different XMLs have only differences listed when "Only show differences" is checked', async ({ page }) => {
    await page.getByTestId('leftXml').fill('<root foo="bar"/>');
    await page.getByTestId('rightXml').fill('<root foo="bar" baz="qux"/>');
    await page.getByRole('switch').click();

    const result = await page.getByTestId('diff-result').innerText();

    expect(result).toContain('{\n@baz: "qux",\n},');
    expect(result).not.toContain('foo');
  });

  test('An element going from a single occurrence to several is diffed cleanly, not as a type change', async ({ page }) => {
    await page.getByTestId('leftXml').fill('<root><item>A</item></root>');
    await page.getByTestId('rightXml').fill('<root><item>A</item><item>B</item></root>');

    const result = await page.getByTestId('diff-result').innerText();

    expect(result).toContain('item: [\n"A",\n"B",\n],');
  });
});
