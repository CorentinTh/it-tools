import { expect, test } from '@playwright/test';

// Cold production startup includes parsing the shared framework/UI shell. On
// this host the 4x-CDP profile varies from roughly 450 to 900 ms depending on
// thermal scheduling, so keep a reviewed 250 ms real-CPU equivalent ceiling.
const HOME_LONG_TASK_BUDGET_MS = 1_000;
const MAX_HOME_DOM_ELEMENTS = 6_000;

test.use({ serviceWorkers: 'block' });

test.describe('Home performance', () => {
  test('renders the complete current catalog within the measured 4x CPU budget', async ({ browserName, context, page }, testInfo) => {
    test.skip(browserName !== 'chromium', 'CPU throttling and the mandatory Long Task baseline use Chromium CDP.');
    test.setTimeout(60_000);

    await page.addInitScript(() => {
      const state = window as typeof window & { __homeLongTasks?: number[] };
      state.__homeLongTasks = [];
      if (PerformanceObserver.supportedEntryTypes.includes('longtask')) {
        const observer = new PerformanceObserver((entries) => {
          state.__homeLongTasks?.push(...entries.getEntries().map(entry => entry.duration));
        });
        observer.observe({ entryTypes: ['longtask'] });
      }
    });

    const cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    try {
      const startedAt = Date.now();
      await page.goto('/');
      const cards = page.locator('a[href] .tool-card');
      await expect(cards.first()).toBeVisible();
      await expect.poll(() => cards.count()).toBeGreaterThanOrEqual(133);
      await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
      await page.waitForTimeout(100);

      const readyMs = Date.now() - startedAt;
      const metrics = await page.evaluate(() => {
        const state = window as typeof window & { __homeLongTasks?: number[] };
        return {
          domElements: document.querySelectorAll('*').length,
          longestTaskMs: Math.max(0, ...(state.__homeLongTasks ?? [])),
          supportsLongTasks: PerformanceObserver.supportedEntryTypes.includes('longtask'),
        };
      });
      testInfo.annotations.push({
        type: 'performance',
        description: `Home 4x CPU: ${readyMs} ms route-ready; ${metrics.longestTaskMs.toFixed(1)} ms longest task; ${metrics.domElements} DOM elements`,
      });

      expect(metrics.domElements).toBeLessThan(MAX_HOME_DOM_ELEMENTS);
      if (metrics.supportsLongTasks) {
        expect(metrics.longestTaskMs).toBeLessThan(HOME_LONG_TASK_BUDGET_MS);
      }
    }
    finally {
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
      await cdp.detach();
    }
  });
});
