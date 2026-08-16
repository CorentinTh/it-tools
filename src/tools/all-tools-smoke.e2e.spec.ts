import { expect, test } from '@playwright/test';

const MINIMUM_TOOL_COUNT = 133;
const FORBIDDEN_CONSOLE_WARNINGS = [
  /Could not create web worker/i,
  /Falling back to loading web worker code in main thread/i,
  /MonacoEnvironment\.getWorker(?:Url)?/i,
];

test.use({ serviceWorkers: 'block' });

test.describe('All tool routes', () => {
  test('every registered tool loads without runtime or chunk errors', async ({ browserName, page }) => {
    test.skip(browserName !== 'chromium', 'Chromium is the mandatory Milestone 0 smoke baseline.');
    test.setTimeout(7 * 60 * 1000);

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
    await expect(toolCards.first()).toBeVisible();
    await expect.poll(() => toolCards.count()).toBeGreaterThanOrEqual(MINIMUM_TOOL_COUNT);
    const renderedToolCount = await toolCards.count();
    expect(renderedToolCount).toBeGreaterThanOrEqual(MINIMUM_TOOL_COUNT);

    const routePaths = await toolCards.evaluateAll(cards => [...new Set(cards.map((card) => {
      const link = card.closest('a');

      return link instanceof HTMLAnchorElement ? link.pathname : '';
    }).filter(Boolean))].sort());

    expect(routePaths).toHaveLength(renderedToolCount);

    for (const routePath of routePaths) {
      currentRoute = routePath;
      await page.evaluate(() => localStorage.clear());
      await page.setViewportSize({ width: 1365, height: 900 });

      const response = await page.goto(routePath, { waitUntil: 'domcontentloaded' });
      expect.soft(response?.ok(), `${routePath} document response`).toBe(true);
      await expect.soft(page.locator('.tool-header h1'), `${routePath} title`).toBeVisible();
      await expect.soft(page.locator('.tool-content > *').first(), `${routePath} content`).toBeVisible();
      await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));

      const desktopAudit = await page.evaluate(() => {
        const isVisible = (element: Element) => element.getClientRects().length > 0;
        const hasAccessibleName = (element: Element) => {
          if (element.getAttribute('aria-label')?.trim()) {
            return true;
          }

          const labelledBy = element.getAttribute('aria-labelledby');
          if (labelledBy?.split(/\s+/).some(id => document.getElementById(id)?.textContent?.trim())) {
            return true;
          }

          return 'labels' in element
            && Array.from((element as HTMLInputElement).labels ?? []).some(label => label.textContent?.trim());
        };
        const unlabelledControls = [...document.querySelectorAll('.tool-content input:not([type="hidden"]), .tool-content textarea, .tool-content select, .tool-content [role="combobox"], .tool-content [role="spinbutton"], .tool-content [role="checkbox"], .tool-content [role="switch"]')]
          .filter(isVisible)
          .filter(element => !hasAccessibleName(element))
          .map(element => ({
            tag: element.tagName.toLowerCase(),
            role: element.getAttribute('role'),
            placeholder: element.getAttribute('placeholder'),
            className: element.getAttribute('class'),
          }));

        return {
          overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
          unlabelledControls,
        };
      });
      expect.soft(desktopAudit.overflow, `${routePath} desktop horizontal overflow`).toBe(false);
      expect.soft(desktopAudit.unlabelledControls, `${routePath} unlabelled visible controls`).toEqual([]);

      await page.getByRole('button', { name: 'Toggle dark/light mode' }).click();
      await expect.soft(page.locator('.app-root'), `${routePath} dark theme`).toHaveClass(/app-root--dark/);
      await page.setViewportSize({ width: 390, height: 844 });
      await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
      const mobileOverflow = await page.evaluate(() => (
        document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      ));
      expect.soft(mobileOverflow, `${routePath} mobile dark horizontal overflow`).toBe(false);
    }

    expect(runtimeErrors, runtimeErrors.join('\n')).toEqual([]);
  });
});
