import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

test.describe('Tool - Emoji picker bounded rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/emoji-picker');
  });

  test('keeps the DOM bounded while windowing the complete catalog', async ({ page }, testInfo) => {
    await expect(page).toHaveTitle('Emoji picker - IT Tools');

    const cards = page.getByTestId('emoji-card');
    await expect.poll(() => cards.count()).toBeGreaterThan(0);
    const initialCardCount = await cards.count();
    expect(initialCardCount).toBeLessThan(110);
    await expect(cards.first()).toHaveAttribute('aria-posinset', '1');
    await expect(cards.first()).toHaveAttribute('aria-setsize', '1914');
    const initialElementCount = await page.locator('*').count();
    testInfo.annotations.push({
      type: 'performance',
      description: `${initialElementCount} initial DOM elements for ${initialCardCount} windowed cards`,
    });
    expect(initialElementCount).toBeLessThan(2400);

    const viewport = page.getByTestId('emoji-virtual-viewport');
    await viewport.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
      element.dispatchEvent(new Event('scroll'));
    });
    await expect.poll(async () => Number(await cards.first().getAttribute('aria-posinset'))).toBeGreaterThan(1_700);
    expect(await cards.count()).toBeLessThan(110);

    await page.getByTestId('emoji-category').selectOption('Flags');
    await expect(cards.first()).toHaveAttribute('aria-posinset', '1');
    await expect(page.getByTestId('emoji-result-status')).toHaveText(/^\s*\d+ emojis available\s*$/);
  });

  test('searches the full catalog without truncating ZWJ and flag sequences', async ({ context, page }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const search = page.getByTestId('emoji-search');

    await search.fill('👨‍👩‍👧‍👦');
    const familyButton = page.getByRole('button', { name: 'Copy Family man, woman, girl, boy emoji' });
    await expect(familyButton).toHaveText('👨‍👩‍👧‍👦');
    await expect(page.getByRole('button', { name: 'Copy code points for Family man, woman, girl, boy' }))
      .toHaveText('0x1f468 0x200d 0x1f469 0x200d 0x1f467 0x200d 0x1f466');

    await familyButton.focus();
    await familyButton.press('Enter');
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('👨‍👩‍👧‍👦');

    await search.fill('🇺🇳');
    await expect(page.getByRole('button', { name: 'Copy Flag United Nations emoji' })).toHaveText('🇺🇳');
    await expect(page.getByRole('button', { name: 'Copy code points for Flag United Nations' }))
      .toHaveText('0x1f1fa 0x1f1f3');
  });

  test('keeps full-catalog search responsive at 4x CPU and its result DOM bounded', async ({ context, page }, testInfo) => {
    const runtimeMode = await page.evaluate(async () => (
      await fetch(globalThis.location.href, { method: 'HEAD' })
    ).headers.get('X-IT-Tools-Mode'));
    const cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    const supportsLongTasks = await page.evaluate(() => PerformanceObserver.supportedEntryTypes.includes('longtask'));
    await page.evaluate(() => {
      const measuredWindow = window as typeof window & { emojiPickerHeartbeat?: number; emojiPickerLongTasks?: number[] };
      measuredWindow.emojiPickerLongTasks = [];
      measuredWindow.emojiPickerHeartbeat = 0;
      globalThis.setInterval(() => {
        measuredWindow.emojiPickerHeartbeat = (measuredWindow.emojiPickerHeartbeat ?? 0) + 1;
      }, 20);

      if (PerformanceObserver.supportedEntryTypes.includes('longtask')) {
        const observer = new PerformanceObserver((entries) => {
          measuredWindow.emojiPickerLongTasks?.push(...entries.getEntries().map(({ duration }) => duration));
        });
        observer.observe({ entryTypes: ['longtask'] });
      }
    });

    const searchStartedAt = Date.now();
    await page.getByTestId('emoji-search').fill('face');
    await expect.poll(() => page.getByTestId('emoji-card').count()).toBeGreaterThan(0);
    await expect(page.getByTestId('emoji-result-status')).toHaveText(/^\s*\d+ emojis available\s*$/);
    await page.waitForTimeout(50);

    const searchElapsedMs = Date.now() - searchStartedAt;
    const { heartbeat, longestTaskMs } = await page.evaluate(() => {
      const measuredWindow = window as typeof window & { emojiPickerHeartbeat?: number; emojiPickerLongTasks?: number[] };
      return {
        heartbeat: measuredWindow.emojiPickerHeartbeat ?? 0,
        longestTaskMs: Math.max(0, ...(measuredWindow.emojiPickerLongTasks ?? [])),
      };
    });
    testInfo.annotations.push({
      type: 'performance',
      description: `${searchElapsedMs} ms search ready at 4x CPU (${runtimeMode ?? 'unknown'}); ${longestTaskMs.toFixed(1)} ms longest task; ${heartbeat} heartbeat ticks`,
    });

    expect(searchElapsedMs).toBeLessThan(5000);
    expect(heartbeat).toBeGreaterThan(5);
    // Dev serves hundreds of unbundled modules and is intentionally excluded
    // from production Long Task acceptance. It remains useful here for the
    // worker/HMR functional flow and heartbeat assertion.
    if (supportsLongTasks && runtimeMode === 'preview') {
      // The complete Unicode 16.0 catalog is intentionally tested under a
      // 4x CPU throttle. Keep the reviewed slow-device ceiling while allowing
      // the browser's first virtual-grid update to cross the 50 ms API floor.
      expect(longestTaskMs).toBeLessThan(200);
    }

    const renderedCardCount = await page.getByTestId('emoji-card').count();
    expect(renderedCardCount).toBeLessThan(110);
  });

  test('cancels a pending worker search and keeps controls usable', async ({ page }) => {
    const search = page.getByTestId('emoji-search');
    await search.fill('face');
    const cancel = page.getByTestId('emoji-cancel-search');
    await expect(cancel).toBeVisible();
    await cancel.click();
    await expect(page.getByRole('alert')).toHaveText('Emoji search was cancelled.');
    await search.fill('United Nations');
    await expect(page.getByRole('button', { name: 'Copy Flag United Nations emoji' })).toBeVisible();
  });
});
