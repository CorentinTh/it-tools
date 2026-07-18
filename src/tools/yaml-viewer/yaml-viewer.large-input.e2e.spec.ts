import { expect, test } from '@playwright/test';

const LARGE_VALUE_CHARACTERS = 1_048_000;
const MAX_OUTPUT_PREVIEW_BYTES = 100_000;

test.use({ serviceWorkers: 'block' });

test.describe('Tool - YAML Prettify bounded worker', () => {
  test('formats a one-megabyte document explicitly while the main thread stays responsive', async ({ page, browserName }, testInfo) => {
    test.setTimeout(30_000);
    const runtimeErrors: string[] = [];

    page.on('pageerror', error => runtimeErrors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') {
        runtimeErrors.push(message.text());
      }
    });

    await page.goto('/yaml-prettify');
    await expect(page).toHaveTitle('YAML prettify and format - IT Tools');
    const input = page.getByPlaceholder('Paste your raw YAML here...');

    await input.evaluate((element, characterCount) => {
      const valueSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;

      if (!valueSetter) {
        throw new Error('Unable to set the YAML textarea value.');
      }

      valueSetter.call(element, `payload: ${'x'.repeat(characterCount)}`);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, LARGE_VALUE_CHARACTERS);

    await expect(page.getByTestId('yaml-format-status')).toContainText('only on request');
    await expect(page.getByTestId('large-output-notice')).toHaveCount(0);

    if (browserName === 'chromium') {
      // A sequential suite reuses one renderer process across many discarded
      // contexts. Collect their garbage before opening the measurement window
      // so this gate measures the current interaction rather than cleanup from
      // unrelated earlier routes. Allocations caused by formatting still occur
      // after this point and remain observable.
      const session = await page.context().newCDPSession(page);
      await session.send('HeapProfiler.collectGarbage');
      await session.detach();
    }

    const supportsLongTasks = await page.evaluate(() => PerformanceObserver.supportedEntryTypes.includes('longtask'));
    await page.evaluate(() => {
      const state = window as Window & {
        __yamlHeartbeat?: number
        __yamlHeartbeatTimer?: number
        __yamlLongTasks?: number[]
      };
      state.__yamlHeartbeat = 0;
      state.__yamlLongTasks = [];
      state.__yamlHeartbeatTimer = window.setInterval(() => {
        state.__yamlHeartbeat = (state.__yamlHeartbeat ?? 0) + 1;
      }, 10);
      if (PerformanceObserver.supportedEntryTypes.includes('longtask')) {
        const observer = new PerformanceObserver((entries) => {
          state.__yamlLongTasks?.push(...entries.getEntries().map(({ duration }) => duration));
        });
        observer.observe({ entryTypes: ['longtask'] });
      }
    });

    const formatStartedAt = Date.now();
    await page.getByTestId('yaml-format-run').click();
    await expect(page.getByTestId('yaml-format-status')).toContainText('formatted in', { timeout: 15_000 });
    await expect(page.getByTestId('large-output-notice')).toBeVisible();

    const output = page.locator('textarea[data-test-id="area-content"]');
    await expect(output).toBeVisible();
    await page.waitForTimeout(50);
    const formatReadyMs = Date.now() - formatStartedAt;
    const outputShape = await output.evaluate(element => ({
      descendantElements: element.querySelectorAll('*').length,
      textLength: (element as HTMLTextAreaElement).value.length,
    }));
    const browserMeasurements = await page.evaluate(() => {
      const state = window as Window & {
        __yamlHeartbeat?: number
        __yamlHeartbeatTimer?: number
        __yamlLongTasks?: number[]
      };
      if (state.__yamlHeartbeatTimer !== undefined) {
        window.clearInterval(state.__yamlHeartbeatTimer);
      }
      return {
        heartbeat: state.__yamlHeartbeat ?? 0,
        longestTaskMs: Math.max(0, ...(state.__yamlLongTasks ?? [])),
      };
    });
    testInfo.annotations.push({
      type: 'performance',
      description: `${formatReadyMs} ms format ready; ${browserMeasurements.longestTaskMs.toFixed(1)} ms longest task`,
    });

    expect(formatReadyMs).toBeLessThan(3_000);
    expect(browserMeasurements.heartbeat, 'The UI heartbeat should continue while the YAML worker formats').toBeGreaterThan(2);
    if (supportsLongTasks) {
      expect(browserMeasurements.longestTaskMs).toBeLessThan(50);
    }
    expect(outputShape.descendantElements).toBe(0);
    expect(outputShape.textLength).toBe(MAX_OUTPUT_PREVIEW_BYTES);
    await expect(page.getByTestId('copy-overlay')).toBeVisible();
    expect(runtimeErrors).toEqual([]);
  });
});
