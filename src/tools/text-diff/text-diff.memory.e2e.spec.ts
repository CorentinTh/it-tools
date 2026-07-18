import { type CDPSession, type Page, expect, test } from '@playwright/test';

const RETAINED_HEAP_BUDGET_BYTES = 5 * 1024 * 1024;
const MEASURED_NAVIGATION_CYCLES = 10;

async function settleRendering(page: Page) {
  await page.evaluate(() => new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  }));
}

async function visitTextDiffAndReturnToControlRoute(page: Page) {
  await page.locator('a[href="/text-diff"]').click();
  await expect(page).toHaveURL(/\/text-diff$/);
  await expect(page.locator('.monaco-diff-editor')).toBeVisible();
  await settleRendering(page);

  await page.locator('a[href="/token-generator"]').click();
  await expect(page).toHaveURL(/\/token-generator$/);
  await expect(page.locator('.tool-content > *').first()).toBeVisible();
  await settleRendering(page);
}

async function collectRetainedHeap(cdp: CDPSession) {
  // Two collections make deferred Monaco/editor finalizers observable before measuring.
  await cdp.send('HeapProfiler.collectGarbage');
  await cdp.send('HeapProfiler.collectGarbage');

  const { usedSize } = await cdp.send('Runtime.getHeapUsage');

  return usedSize;
}

test.describe('Tool - Text Diff memory', () => {
  test('retains less than 5 MiB after repeated navigation', async ({ browserName, context, page }, testInfo) => {
    test.skip(browserName !== 'chromium', 'Forced GC and heap measurement require Chromium CDP.');
    test.setTimeout(2 * 60 * 1000);

    await page.goto('/token-generator');
    await expect(page.locator('.tool-content > *').first()).toBeVisible();

    const cdp = await context.newCDPSession(page);
    try {
      await cdp.send('HeapProfiler.enable');

      // Load Monaco once so its lazy modules and stable caches are included in the baseline.
      await visitTextDiffAndReturnToControlRoute(page);
      const warmedBaselineBytes = await collectRetainedHeap(cdp);

      for (let cycle = 0; cycle < MEASURED_NAVIGATION_CYCLES; cycle += 1) {
        await visitTextDiffAndReturnToControlRoute(page);
      }

      expect(page.workers()).toHaveLength(0);
      const finalRetainedBytes = await collectRetainedHeap(cdp);
      const retainedGrowthBytes = finalRetainedBytes - warmedBaselineBytes;
      testInfo.annotations.push({
        type: 'retained-heap',
        description: [
          `baseline=${warmedBaselineBytes}`,
          `final=${finalRetainedBytes}`,
          `growth=${retainedGrowthBytes}`,
          `cycles=${MEASURED_NAVIGATION_CYCLES}`,
        ].join(' '),
      });

      expect(retainedGrowthBytes, [
        `Retained heap grew by ${(retainedGrowthBytes / 1024 / 1024).toFixed(2)} MiB`,
        `after ${MEASURED_NAVIGATION_CYCLES} warmed Text Diff navigation cycles`,
        `(baseline ${(warmedBaselineBytes / 1024 / 1024).toFixed(2)} MiB,`,
        `final ${(finalRetainedBytes / 1024 / 1024).toFixed(2)} MiB).`,
      ].join(' ')).toBeLessThan(RETAINED_HEAP_BUDGET_BYTES);
    }
    finally {
      await cdp.detach();
    }
  });
});
