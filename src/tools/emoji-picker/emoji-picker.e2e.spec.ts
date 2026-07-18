import { expect, test } from '@playwright/test';

const EMOJI_PAGE_SIZE = 60;

test.use({ serviceWorkers: 'block' });

test.describe('Tool - Emoji picker bounded rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/emoji-picker');
  });

  test('keeps the initial DOM bounded and progressively renders pages', async ({ page }, testInfo) => {
    await expect(page).toHaveTitle('Emoji picker - IT Tools');

    const cards = page.getByTestId('emoji-card');
    await expect(cards).toHaveCount(EMOJI_PAGE_SIZE);
    const initialElementCount = await page.locator('*').count();
    testInfo.annotations.push({
      type: 'performance',
      description: `${initialElementCount} initial DOM elements for ${EMOJI_PAGE_SIZE} cards`,
    });
    expect(initialElementCount).toBeLessThan(2000);

    await page.getByTestId('emoji-load-more').click();
    await expect(cards).toHaveCount(EMOJI_PAGE_SIZE * 2);

    await page.getByTestId('emoji-category').selectOption('Flags');
    await expect(cards).toHaveCount(EMOJI_PAGE_SIZE);
    await expect(page.getByTestId('emoji-result-status')).toContainText(`Showing ${EMOJI_PAGE_SIZE} of`);
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

  test('keeps full-catalog search responsive and its result DOM bounded', async ({ page }, testInfo) => {
    const supportsLongTasks = await page.evaluate(() => PerformanceObserver.supportedEntryTypes.includes('longtask'));
    await page.evaluate(() => {
      const measuredWindow = window as typeof window & { emojiPickerLongTasks?: number[] };
      measuredWindow.emojiPickerLongTasks = [];

      if (PerformanceObserver.supportedEntryTypes.includes('longtask')) {
        const observer = new PerformanceObserver((entries) => {
          measuredWindow.emojiPickerLongTasks?.push(...entries.getEntries().map(({ duration }) => duration));
        });
        observer.observe({ entryTypes: ['longtask'] });
      }
    });

    const searchStartedAt = Date.now();
    await page.getByTestId('emoji-search').fill('face');
    await expect(page.getByTestId('emoji-card')).toHaveCount(EMOJI_PAGE_SIZE);
    await expect(page.getByTestId('emoji-result-status')).toHaveText(/^\s*Showing 60 of \d+ emojis\s*$/);
    await page.waitForTimeout(50);

    const searchElapsedMs = Date.now() - searchStartedAt;
    const longestTaskMs = await page.evaluate(() => Math.max(
      0,
      ...((window as typeof window & { emojiPickerLongTasks?: number[] }).emojiPickerLongTasks ?? []),
    ));
    testInfo.annotations.push({
      type: 'performance',
      description: `${searchElapsedMs} ms search ready; ${longestTaskMs.toFixed(1)} ms longest task`,
    });

    expect(searchElapsedMs).toBeLessThan(1500);
    if (supportsLongTasks) {
      expect(longestTaskMs).toBeLessThan(500);
    }

    await page.getByTestId('emoji-load-more').click();
    await expect(page.getByTestId('emoji-card')).toHaveCount(EMOJI_PAGE_SIZE * 2);
  });
});
