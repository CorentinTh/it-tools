import { expect, test } from '@playwright/test';

const EXPECTED_TOOL_COUNT = 87;
const FORBIDDEN_CONSOLE_WARNINGS = [
  /Could not create web worker/i,
  /Falling back to loading web worker code in main thread/i,
  /MonacoEnvironment\.getWorker(?:Url)?/i,
];

test.use({ serviceWorkers: 'block' });

test.describe('All tool routes', () => {
  test('every registered tool loads without runtime or chunk errors', async ({ browserName, page }) => {
    test.skip(browserName !== 'chromium', 'Chromium is the mandatory Milestone 0 smoke baseline.');
    test.setTimeout(5 * 60 * 1000);

    const runtimeErrors: string[] = [];
    let currentRoute = '/';

    page.on('pageerror', (error) => {
      runtimeErrors.push(`${currentRoute}: pageerror: ${error.message}`);
    });
    page.on('console', (message) => {
      const isForbiddenWarning = message.type() === 'warning'
        && FORBIDDEN_CONSOLE_WARNINGS.some(pattern => pattern.test(message.text()));

      if (message.type() === 'error' || isForbiddenWarning) {
        runtimeErrors.push(`${currentRoute}: console: ${message.text()}`);
      }
    });
    page.on('requestfailed', (request) => {
      if (request.resourceType() === 'script') {
        runtimeErrors.push(`${currentRoute}: script request failed: ${request.url()} (${request.failure()?.errorText ?? 'unknown error'})`);
      }
    });
    page.on('response', (response) => {
      if (response.request().resourceType() === 'script' && response.status() >= 400) {
        runtimeErrors.push(`${currentRoute}: script response ${response.status()}: ${response.url()}`);
      }
    });

    await page.goto('/');

    const toolCards = page.locator('a[href] .tool-card');
    await expect(toolCards).toHaveCount(EXPECTED_TOOL_COUNT);

    const routePaths = await toolCards.evaluateAll(cards => [...new Set(cards.map((card) => {
      const link = card.closest('a');

      return link instanceof HTMLAnchorElement ? link.pathname : '';
    }).filter(Boolean))].sort());

    expect(routePaths).toHaveLength(EXPECTED_TOOL_COUNT);

    for (const routePath of routePaths) {
      currentRoute = routePath;
      await page.evaluate(() => localStorage.clear());

      const response = await page.goto(routePath, { waitUntil: 'domcontentloaded' });
      expect.soft(response?.ok(), `${routePath} document response`).toBe(true);
      await expect.soft(page.locator('.tool-header h1'), `${routePath} title`).toBeVisible();
      await expect.soft(page.locator('.tool-content > *').first(), `${routePath} content`).toBeVisible();
      await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    }

    expect(runtimeErrors, runtimeErrors.join('\n')).toEqual([]);
  });
});
