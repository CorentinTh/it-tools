import { expect, test } from '@playwright/test';

const LARGE_VALUE_CHARACTERS = 1_048_000;
const MAX_OUTPUT_PREVIEW_BYTES = 100_000;

test.use({ serviceWorkers: 'block' });

test.describe('Tool - JSON Prettify bounded lossless worker', () => {
  test('formats a one-megabyte document explicitly while the main thread stays responsive', async ({ page, context }, testInfo) => {
    test.setTimeout(30_000);
    const runtimeErrors: string[] = [];
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    page.on('pageerror', error => runtimeErrors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') {
        runtimeErrors.push(message.text());
      }
    });

    const routeStartedAt = Date.now();
    await page.goto('/json-prettify');
    await expect(page).toHaveTitle('JSON prettify and format - IT Tools');
    const coldRouteReadyMs = Date.now() - routeStartedAt;
    const input = page.getByPlaceholder('Paste your raw JSON here...');

    await input.evaluate((element, characterCount) => {
      const valueSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;

      if (!valueSetter) {
        throw new Error('Unable to set the JSON textarea value.');
      }

      valueSetter.call(
        element,
        `{"large":17478252242305210114,"decimal":1.2300,"exponent":1E+09,"payload":"${'x'.repeat(characterCount)}"}`,
      );
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, LARGE_VALUE_CHARACTERS);

    await expect(page.getByTestId('json-format-status')).toContainText('only on request');
    await expect(page.getByTestId('large-output-notice')).toHaveCount(0);

    const supportsLongTasks = await page.evaluate(() => PerformanceObserver.supportedEntryTypes.includes('longtask'));
    await page.evaluate(() => {
      const state = window as Window & {
        __jsonHeartbeat?: number
        __jsonHeartbeatTimer?: number
        __jsonLongTasks?: number[]
      };
      state.__jsonHeartbeat = 0;
      state.__jsonLongTasks = [];
      state.__jsonHeartbeatTimer = window.setInterval(() => {
        state.__jsonHeartbeat = (state.__jsonHeartbeat ?? 0) + 1;
      }, 10);
      if (PerformanceObserver.supportedEntryTypes.includes('longtask')) {
        const observer = new PerformanceObserver((entries) => {
          state.__jsonLongTasks?.push(...entries.getEntries().map(({ duration }) => duration));
        });
        observer.observe({ entryTypes: ['longtask'] });
      }
    });

    const formatStartedAt = Date.now();
    await page.getByTestId('json-format-run').click();
    await expect(page.getByTestId('json-format-status')).toContainText('formatted in', { timeout: 15_000 });
    await expect(page.getByTestId('large-output-notice')).toBeVisible();

    const output = page.locator('textarea[data-test-id="area-content"]');
    await expect(output).toBeVisible();
    await page.waitForTimeout(50);
    const formatReadyMs = Date.now() - formatStartedAt;

    const outputShape = await output.evaluate((element) => {
      const value = (element as HTMLTextAreaElement).value;
      return {
        descendantElements: element.querySelectorAll('*').length,
        textLength: value.length,
        preservesLargeInteger: value.includes('17478252242305210114'),
        preservesDecimal: value.includes('1.2300'),
        preservesExponent: value.includes('1E+09'),
      };
    });
    const browserMeasurements = await page.evaluate(() => {
      const state = window as Window & {
        __jsonHeartbeat?: number
        __jsonHeartbeatTimer?: number
        __jsonLongTasks?: number[]
      };
      if (state.__jsonHeartbeatTimer !== undefined) {
        window.clearInterval(state.__jsonHeartbeatTimer);
      }
      return {
        heartbeat: state.__jsonHeartbeat ?? 0,
        longestTaskMs: Math.max(0, ...(state.__jsonLongTasks ?? [])),
      };
    });
    testInfo.annotations.push({
      type: 'performance',
      description: `${coldRouteReadyMs} ms cold route; ${formatReadyMs} ms format ready; ${browserMeasurements.longestTaskMs.toFixed(1)} ms longest task`,
    });

    expect(coldRouteReadyMs).toBeLessThan(3_000);
    expect(formatReadyMs).toBeLessThan(3_000);
    expect(browserMeasurements.heartbeat, 'The UI heartbeat should continue while the JSON worker formats').toBeGreaterThan(2);
    if (supportsLongTasks) {
      expect(browserMeasurements.longestTaskMs).toBeLessThan(50);
    }
    expect(outputShape.descendantElements).toBe(0);
    expect(outputShape.textLength).toBe(MAX_OUTPUT_PREVIEW_BYTES);
    expect(outputShape.preservesLargeInteger).toBe(true);
    expect(outputShape.preservesDecimal).toBe(true);
    expect(outputShape.preservesExponent).toBe(true);
    await expect(page.getByTestId('copy-overlay')).toBeVisible();
    await page.getByTestId('copy-overlay').getByRole('button').click();
    const copiedOutput = await page.evaluate(() => navigator.clipboard.readText());
    expect(copiedOutput.length).toBeGreaterThan(LARGE_VALUE_CHARACTERS);
    expect(copiedOutput).toContain('17478252242305210114');
    expect(copiedOutput).toContain('1.2300');
    expect(copiedOutput).toContain('1E+09');
    expect(runtimeErrors).toEqual([]);
  });
});
