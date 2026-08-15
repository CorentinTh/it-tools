import { expect, test } from '@playwright/test';

test.describe('Tool - JSON diff', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-diff');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('JSON diff - IT Tools');
  });

  test('Identical JSONs have a custom result message', async ({ page }) => {
    await page.getByTestId('leftJson').fill('{"foo":"bar"}');
    await page.getByTestId('rightJson').fill('{   "foo":  "bar" }  ');
    await page.getByTestId('json-diff-run').click();

    const result = await page.getByTestId('diff-result').innerText();

    expect(result).toContain('The provided JSONs are the same');
  });

  test('Different JSONs have differences listed', async ({ page }) => {
    await page.getByTestId('leftJson').fill('{"foo":"bar"}');
    await page.getByTestId('rightJson').fill('{"foo":"buz","baz":"qux"}');
    await page.getByTestId('json-diff-run').click();

    const result = await page.getByTestId('diff-result').innerText();

    expect(result).toContain('{\nfoo: "bar""buz",\nbaz: "qux",\n},');
  });

  test('Different JSONs have only differences listed when "Only show differences" is checked', async ({ page }) => {
    await page.getByTestId('leftJson').fill('{"foo":"bar"}');
    await page.getByTestId('rightJson').fill('{"foo":"bar","baz":"qux"}');
    await page.getByRole('switch', { name: 'Only show differences' }).click();
    await page.getByTestId('json-diff-run').click();

    const result = await page.getByTestId('diff-result').innerText();

    expect(result).toContain('{\nbaz: "qux",\n},');
  });

  test('Large results render progressively instead of mounting every line at once', async ({ page }) => {
    const right = Object.fromEntries(Array.from({ length: 450 }, (_, index) => [`key-${index}`, index]));
    await page.getByTestId('leftJson').fill('{}');
    await page.getByTestId('rightJson').fill(JSON.stringify(right));
    await page.getByTestId('json-diff-run').click();

    await expect(page.getByTestId('diff-result').locator('.result')).toHaveCount(200);
    const showMore = page.getByTestId('diff-show-more');
    await expect(showMore).toContainText('Show 200 more (250 remaining)');

    await showMore.click();
    await expect(page.getByTestId('diff-result').locator('.result')).toHaveCount(400);
    await expect(showMore).toContainText('Show 50 more (50 remaining)');
  });

  test('Aligns inserted primitive array items without cascading updates', async ({ page }) => {
    await page.getByTestId('leftJson').fill('["alpha","beta","gamma"]');
    await page.getByTestId('rightJson').fill('["new","alpha","beta","gamma"]');
    await page.getByTestId('json-diff-run').click();

    await expect(page.getByTestId('json-diff-status')).toContainText('1 array aligned by key/LCS');
    await expect(page.getByTestId('diff-result').locator('.result.added')).toHaveCount(1);
    await expect(page.getByTestId('diff-result').locator('.result.removed')).toHaveCount(0);
  });

  test('Reports invalid and oversized input through the bounded task state', async ({ page }) => {
    await page.getByTestId('leftJson').fill('{ broken');
    await page.getByTestId('rightJson').fill('{}');
    await page.getByTestId('json-diff-run').click();
    await expect(page.getByTestId('json-diff-status')).toContainText('not valid JSON or JSON5');

    await page.getByTestId('leftJson').fill(`"${'a'.repeat(1024 * 1024)}"`);
    await page.getByTestId('json-diff-run').click();
    await expect(page.getByTestId('json-diff-status')).toContainText('limited to 1,048,576 UTF-8 bytes');
  });
});
