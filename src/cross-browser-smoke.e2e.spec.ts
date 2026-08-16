import { expect, test } from '@playwright/test';

const MINIMUM_TOOL_COUNT = 131;

test.use({ serviceWorkers: 'block' });

test.describe('Cross-browser application smoke', () => {
  test('loads Home and completes a worker-backed transformation', async ({ browserName, page }) => {
    const runtimeErrors: string[] = [];
    page.on('pageerror', error => runtimeErrors.push(`pageerror: ${error.message}`));
    page.on('console', (message) => {
      if (message.type() === 'error') {
        runtimeErrors.push(`console: ${message.text()}`);
      }
    });

    await page.goto('/');
    await expect(page).toHaveTitle('IT Tools - Handy online tools for developers');
    const toolCards = page.locator('a[href] .tool-card');
    await expect(toolCards.first()).toBeVisible();
    await expect.poll(() => toolCards.count()).toBeGreaterThanOrEqual(MINIMUM_TOOL_COUNT);

    await page.goto('/json-to-csv');
    await page.getByTestId('input').fill('[{"name":"Firefox"},{"name":"WebKit"}]');
    await expect(page.getByTestId('json-to-csv-status')).toContainText('completed');
    await expect(page.getByTestId('area-content')).toHaveText('name\nFirefox\nWebKit');

    const horizontalOverflow = await page.evaluate(() => (
      document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    ));
    expect(horizontalOverflow, `${browserName} must not create horizontal overflow`).toBe(false);
    expect(runtimeErrors, runtimeErrors.join('\n')).toEqual([]);
  });
});
