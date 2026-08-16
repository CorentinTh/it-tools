import { expect, test } from '@playwright/test';

const DEFAULT_NANOID_PATTERN = /^[_\-0-9a-zA-Z]{21}$/;

test.describe('Tool - NanoID generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/nanoid-generator');
  });

  test('loads with one secure URL-safe identifier and collision guidance', async ({ page }) => {
    await expect(page).toHaveTitle('NanoID generator - IT Tools');
    await expect(page.getByTestId('nanoid-output')).toHaveValue(DEFAULT_NANOID_PATTERN);
    await expect(page.getByTestId('nanoid-guidance')).toContainText('126.00 bits');
    await expect(page.getByTestId('nanoid-guidance')).toContainText('8.51 × 10^37');
  });

  test('applies bounded custom settings only after Generate', async ({ page }) => {
    const initialOutput = await page.getByTestId('nanoid-output').inputValue();

    await page.getByTestId('nanoid-length').fill('5');
    await page.getByTestId('nanoid-quantity').fill('3');
    await page.getByTestId('nanoid-custom-alphabet').click();
    await page.getByTestId('nanoid-alphabet').fill('AB');

    await expect(page.getByTestId('nanoid-output')).toHaveValue(initialOutput);
    await expect(page.getByTestId('nanoid-stale')).toBeVisible();

    await page.getByTestId('nanoid-generate').click();

    const ids = (await page.getByTestId('nanoid-output').inputValue()).split('\n');
    expect(ids).toHaveLength(3);
    expect(ids.every(id => /^[AB]{5}$/.test(id))).toBe(true);
    await expect(page.getByTestId('nanoid-stale')).toHaveCount(0);
  });

  test('downloads and clears generated IDs without persisting or transmitting them', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const observedRequests: Array<{ url: string; body: string | null }> = [];
    page.on('request', (request) => {
      observedRequests.push({ url: request.url(), body: request.postData() });
    });

    await page.getByTestId('nanoid-custom-alphabet').click();
    await page.getByTestId('nanoid-alphabet').fill('QZ');
    await page.getByTestId('nanoid-generate').click();
    const output = await page.getByTestId('nanoid-output').inputValue();

    await page.getByTestId('nanoid-copy').click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(output);

    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('nanoid-download').click();
    const download = await downloadPromise;
    const stream = await download.createReadStream();
    if (!stream) {
      throw new Error('The NanoID download stream is unavailable.');
    }
    let downloadedContent = '';
    for await (const chunk of stream) {
      downloadedContent += chunk.toString();
    }

    expect(download.suggestedFilename()).toBe('nanoids.txt');
    expect(downloadedContent).toBe(output);
    expect(page.url()).not.toContain(output);
    expect(page.url()).not.toContain('QZ');
    expect(observedRequests.every(({ url, body }) => !url.includes(output) && !url.includes('QZ')
      && !body?.includes(output) && !body?.includes('QZ'))).toBe(true);

    const storedValues = await page.evaluate(() => Object.values(localStorage));
    expect(storedValues.every(value => !value.includes(output) && !value.includes('QZ'))).toBe(true);

    await page.getByTestId('nanoid-clear').click();
    await expect(page.getByTestId('nanoid-output')).toHaveValue('');
    await expect(page.getByTestId('nanoid-copy')).toBeDisabled();
    await expect(page.getByTestId('nanoid-download')).toBeDisabled();
  });

  test('keeps the maximum accepted batch within the main-thread interaction budget', async ({ page, browserName }, testInfo) => {
    await page.getByTestId('nanoid-length').fill('100');
    await page.getByTestId('nanoid-quantity').fill('1000');

    if (browserName === 'chromium') {
      const session = await page.context().newCDPSession(page);
      await session.send('HeapProfiler.collectGarbage');
      await session.detach();
    }
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    await page.waitForTimeout(50);

    const supportsLongTasks = await page.evaluate(() => PerformanceObserver.supportedEntryTypes.includes('longtask'));
    await page.evaluate(() => {
      const measuredWindow = window as typeof window & { nanoIdLongTasks?: number[] };
      measuredWindow.nanoIdLongTasks = [];

      if (PerformanceObserver.supportedEntryTypes.includes('longtask')) {
        const observer = new PerformanceObserver((entries) => {
          measuredWindow.nanoIdLongTasks?.push(...entries.getEntries().map(({ duration }) => duration));
        });
        observer.observe({ entryTypes: ['longtask'] });
      }
    });

    const generationStartedAt = Date.now();
    await page.getByTestId('nanoid-generate').click();
    await expect.poll(async () => (await page.getByTestId('nanoid-output').inputValue()).length)
      .toBe(100_999);
    await page.waitForTimeout(50);

    const output = await page.getByTestId('nanoid-output').inputValue();
    const ids = output.split('\n');
    const generationElapsedMs = Date.now() - generationStartedAt;
    const longestTaskMs = await page.evaluate(() => Math.max(
      0,
      ...((window as typeof window & { nanoIdLongTasks?: number[] }).nanoIdLongTasks ?? []),
    ));
    testInfo.annotations.push({
      type: 'performance',
      description: `${generationElapsedMs} ms maximum batch; ${longestTaskMs.toFixed(1)} ms longest task`,
    });

    expect(ids).toHaveLength(1_000);
    expect(ids.every(id => id.length === 100 && /^[_\-0-9a-zA-Z]+$/.test(id))).toBe(true);
    expect(generationElapsedMs).toBeLessThan(1_500);
    if (supportsLongTasks) {
      expect(longestTaskMs).toBeLessThan(50);
    }
  });
});
