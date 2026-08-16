import { type CDPSession, type Page, expect, test } from '@playwright/test';

const RETAINED_HEAP_BUDGET_BYTES = 5 * 1024 * 1024;
const MEASURED_NAVIGATION_CYCLES = 10;

async function settleRendering(page: Page) {
  await page.evaluate(() => new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  }));
}

async function visitHomeAndReturnToTool(page: Page) {
  await page.locator('a[href="/"]').first().click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('.grid-wrapper')).toBeVisible();
  // Compare equivalent fully-rendered visits. Leaving while the progressive
  // Home batches are still mounting makes the forced-GC baseline depend on
  // scheduler timing instead of retained application ownership.
  await expect.poll(() => page.locator('a[href] .tool-card').count()).toBeGreaterThanOrEqual(133);
  await settleRendering(page);

  await page.locator('a[href="/token-generator"]').first().click();
  await expect(page).toHaveURL(/\/token-generator$/);
  await expect(page.locator('.tool-content > *').first()).toBeVisible();
  await settleRendering(page);
}

async function collectMemoryState(cdp: CDPSession) {
  await cdp.send('HeapProfiler.collectGarbage');
  await cdp.send('HeapProfiler.collectGarbage');

  const { usedSize } = await cdp.send('Runtime.getHeapUsage');
  const domCounters = await cdp.send('Memory.getDOMCounters');

  return { usedSize, ...domCounters };
}

test.describe('Home memory', () => {
  test('retains less than 5 MiB after repeated Home and tool navigation', async ({ browserName, context, page }, testInfo) => {
    test.skip(browserName !== 'chromium', 'Forced GC and heap measurement require Chromium CDP.');
    test.setTimeout(2 * 60 * 1000);

    await page.goto('/token-generator');
    await expect(page.locator('.tool-content > *').first()).toBeVisible();

    const cdp = await context.newCDPSession(page);
    try {
      await cdp.send('HeapProfiler.enable');

      await visitHomeAndReturnToTool(page);
      const warmedBaseline = await collectMemoryState(cdp);

      for (let cycle = 0; cycle < MEASURED_NAVIGATION_CYCLES; cycle += 1) {
        await visitHomeAndReturnToTool(page);
      }

      const finalRetained = await collectMemoryState(cdp);
      const retainedGrowthBytes = finalRetained.usedSize - warmedBaseline.usedSize;
      testInfo.annotations.push({
        type: 'retained-heap',
        description: [
          `baseline=${warmedBaseline.usedSize}`,
          `final=${finalRetained.usedSize}`,
          `growth=${retainedGrowthBytes}`,
          `cycles=${MEASURED_NAVIGATION_CYCLES}`,
          `documents=${warmedBaseline.documents}->${finalRetained.documents}`,
          `nodes=${warmedBaseline.nodes}->${finalRetained.nodes}`,
          `listeners=${warmedBaseline.jsEventListeners}->${finalRetained.jsEventListeners}`,
        ].join(' '),
      });

      expect(retainedGrowthBytes, [
        `Retained heap grew by ${(retainedGrowthBytes / 1024 / 1024).toFixed(2)} MiB`,
        `after ${MEASURED_NAVIGATION_CYCLES} warmed Home navigation cycles`,
        `(baseline ${(warmedBaseline.usedSize / 1024 / 1024).toFixed(2)} MiB,`,
        `final ${(finalRetained.usedSize / 1024 / 1024).toFixed(2)} MiB,`,
        `DOM nodes ${warmedBaseline.nodes}->${finalRetained.nodes},`,
        `listeners ${warmedBaseline.jsEventListeners}->${finalRetained.jsEventListeners}).`,
      ].join(' ')).toBeLessThan(RETAINED_HEAP_BUDGET_BYTES);
    }
    finally {
      await cdp.detach();
    }
  });
});
