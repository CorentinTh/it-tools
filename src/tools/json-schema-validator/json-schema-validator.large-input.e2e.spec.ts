import { expect, test } from '@playwright/test';

const LARGE_STRING_CHARACTERS = 1_048_000;

test.use({ serviceWorkers: 'block' });

test.describe('Tool - JSON Schema validator bounded worker', () => {
  test('validates a one-megabyte instance while the main thread stays responsive', async ({ page, browserName }, testInfo) => {
    test.setTimeout(30_000);
    const runtimeErrors: string[] = [];

    page.on('pageerror', error => runtimeErrors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') {
        runtimeErrors.push(message.text());
      }
    });

    const coldRouteStartedAt = Date.now();
    await page.goto('/json-schema-validator');
    await expect(page).toHaveTitle('JSON Schema validator - IT Tools');
    const coldRouteReadyMs = Date.now() - coldRouteStartedAt;
    await page.getByTestId('json-schema-source').fill(`{
      "type": "object",
      "properties": {
        "payload": { "type": "string", "minLength": ${LARGE_STRING_CHARACTERS} }
      },
      "required": ["payload"],
      "additionalProperties": false
    }`);

    const instanceInput = page.getByTestId('json-schema-instance');
    await instanceInput.evaluate((element, characterCount) => {
      const valueSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;

      if (!valueSetter) {
        throw new Error('Unable to set the JSON instance textarea value.');
      }

      valueSetter.call(element, JSON.stringify({ payload: 'x'.repeat(characterCount) }));
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, LARGE_STRING_CHARACTERS);

    await expect(page.getByTestId('json-schema-status')).toContainText('Select Validate');
    await expect(page.getByTestId('json-schema-errors')).toHaveCount(0);

    await page.evaluate(() => new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    }));

    if (browserName === 'chromium') {
      const session = await page.context().newCDPSession(page);
      await session.send('HeapProfiler.collectGarbage');
      await session.detach();
    }

    // Keep textarea rendering and explicit garbage collection outside the
    // measurement window so only the requested worker interaction is gated.
    await page.waitForTimeout(100);

    const supportsLongTasks = await page.evaluate(() => PerformanceObserver.supportedEntryTypes.includes('longtask'));
    await page.evaluate(() => {
      const state = window as Window & {
        __jsonSchemaHeartbeat?: number
        __jsonSchemaHeartbeatTimer?: number
        __jsonSchemaLongTasks?: number[]
      };
      state.__jsonSchemaHeartbeat = 0;
      state.__jsonSchemaLongTasks = [];
      state.__jsonSchemaHeartbeatTimer = window.setInterval(() => {
        state.__jsonSchemaHeartbeat = (state.__jsonSchemaHeartbeat ?? 0) + 1;
      }, 10);
      if (PerformanceObserver.supportedEntryTypes.includes('longtask')) {
        const observer = new PerformanceObserver((entries) => {
          state.__jsonSchemaLongTasks?.push(...entries.getEntries().map(({ duration }) => duration));
        });
        observer.observe({ entryTypes: ['longtask'] });
      }
    });

    const validationStartedAt = Date.now();
    await page.getByTestId('json-schema-validate').click();
    await expect(page.getByTestId('json-schema-status')).toContainText('is valid', { timeout: 15_000 });
    await page.waitForTimeout(50);
    const validationReadyMs = Date.now() - validationStartedAt;
    const browserMeasurements = await page.evaluate(() => {
      const state = window as Window & {
        __jsonSchemaHeartbeat?: number
        __jsonSchemaHeartbeatTimer?: number
        __jsonSchemaLongTasks?: number[]
      };
      if (state.__jsonSchemaHeartbeatTimer !== undefined) {
        window.clearInterval(state.__jsonSchemaHeartbeatTimer);
      }
      return {
        heartbeat: state.__jsonSchemaHeartbeat ?? 0,
        longestTaskMs: Math.max(0, ...(state.__jsonSchemaLongTasks ?? [])),
      };
    });
    testInfo.annotations.push({
      type: 'performance',
      description: `${coldRouteReadyMs} ms cold route; ${validationReadyMs} ms validation ready; ${browserMeasurements.longestTaskMs.toFixed(1)} ms longest task`,
    });

    expect(coldRouteReadyMs).toBeLessThan(3_000);
    expect(validationReadyMs).toBeLessThan(3_000);
    expect(browserMeasurements.heartbeat, 'The UI heartbeat should continue while the JSON Schema worker validates').toBeGreaterThan(2);
    if (supportsLongTasks) {
      expect(browserMeasurements.longestTaskMs).toBeLessThan(50);
    }
    expect(runtimeErrors).toEqual([]);
  });
});
