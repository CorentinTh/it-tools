import { expect, test } from '@playwright/test';

test.describe('Tool - JSON prettify and format', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-prettify');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('JSON prettify and format - IT Tools');
  });

  test('prettifies and formats valid JSON', async ({ page }) => {
    await page.getByTestId('json-prettify-input').fill('{"b":2,"a":1,"c":{"z":3,"y":2}}');

    const prettifiedJson = await page.getByTestId('area-content').innerText();

    expect(prettifiedJson.trim()).toContain('"a": 1');
    expect(prettifiedJson.trim()).toContain('"b": 2');
    // Keys should be sorted alphabetically
    expect(prettifiedJson.indexOf('"a"')).toBeLessThan(prettifiedJson.indexOf('"b"'));
  });

  test('handles sort keys toggle', async ({ page }) => {
    await page.getByTestId('json-prettify-input').fill('{"b":2,"a":1}');

    // Disable sort keys
    await page.locator('label:has-text("Sort keys")').locator('input[type="checkbox"]').click();

    const unsortedJson = await page.getByTestId('area-content').innerText();

    // Keys should maintain original order when sorting is disabled
    expect(unsortedJson.indexOf('"b"')).toBeLessThan(unsortedJson.indexOf('"a"'));
  });

  test('handles custom indent size', async ({ page }) => {
    await page.getByTestId('json-prettify-input').fill('{"a":1}');

    // Change indent size to 2
    await page.locator('label:has-text("Indent size")').locator('input[type="number"]').fill('2');

    const formattedJson = await page.getByTestId('area-content').innerText();

    // Should use 2-space indentation
    expect(formattedJson).toContain('  "a": 1');
  });

  test('auto-unescape functionality works with escaped JSON', async ({ page }) => {
    const escapedJson = '"{\\\"id\\\":\\\"123\\\",\\\"name\\\":\\\"test\\\"}"';

    await page.getByTestId('json-prettify-input').fill(escapedJson);

    // Enable auto-unescape
    await page.locator('label:has-text("Auto-unescape")').locator('input[type="checkbox"]').click();

    const unescapedJson = await page.getByTestId('area-content').innerText();

    expect(unescapedJson).toContain('"id": "123"');
    expect(unescapedJson).toContain('"name": "test"');
    expect(unescapedJson).not.toContain('\\"');
  });

  test('auto-unescape toggle affects validation', async ({ page }) => {
    const escapedJson = '"{\\\"valid\\\":\\\"json\\\"}"';

    // First, paste escaped JSON without auto-unescape (should show validation error)
    await page.getByTestId('json-prettify-input').fill(escapedJson);

    // Should show validation error
    await expect(page.locator('text=Provided JSON is not valid.')).toBeVisible();

    // Enable auto-unescape
    await page.locator('label:has-text("Auto-unescape")').locator('input[type="checkbox"]').click();

    // Validation error should disappear
    await expect(page.locator('text=Provided JSON is not valid.')).not.toBeVisible();

    // Output should be properly formatted
    const formattedJson = await page.getByTestId('area-content').innerText();
    expect(formattedJson).toContain('"valid": "json"');
  });

  test('displays helpful placeholder text', async ({ page }) => {
    const textarea = page.getByTestId('json-prettify-input');

    await expect(textarea).toHaveAttribute('placeholder', /auto-unescape.*escaped json/i);
  });
});
