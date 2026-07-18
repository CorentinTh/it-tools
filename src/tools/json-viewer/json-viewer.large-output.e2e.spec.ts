import { expect, test } from '@playwright/test';

const LARGE_VALUE_CHARACTERS = 1_048_576;

test.use({ serviceWorkers: 'block' });

test.describe('Tool - JSON Viewer large output', () => {
  test('falls back to bounded plain markup for a one-megabyte result', async ({ page }) => {
    test.setTimeout(30_000);
    const runtimeErrors: string[] = [];

    page.on('pageerror', error => runtimeErrors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') {
        runtimeErrors.push(message.text());
      }
    });

    await page.goto('/json-prettify');
    const input = page.getByPlaceholder('Paste your raw JSON here...');

    await input.evaluate((element, characterCount) => {
      const valueSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;

      if (!valueSetter) {
        throw new Error('Unable to set the JSON textarea value.');
      }

      valueSetter.call(element, JSON.stringify({ payload: 'x'.repeat(characterCount) }));
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, LARGE_VALUE_CHARACTERS);

    await expect(page.getByTestId('large-output-notice')).toBeVisible();
    const output = page.locator('pre[data-test-id="area-content"]');
    await expect(output).toBeVisible();

    const outputShape = await output.evaluate(element => ({
      descendantElements: element.querySelectorAll('*').length,
      textLength: element.textContent?.length ?? 0,
    }));

    expect(outputShape.descendantElements).toBe(0);
    expect(outputShape.textLength).toBeGreaterThan(LARGE_VALUE_CHARACTERS);
    await expect(page.getByTestId('copy-overlay')).toBeVisible();
    expect(runtimeErrors).toEqual([]);
  });
});
