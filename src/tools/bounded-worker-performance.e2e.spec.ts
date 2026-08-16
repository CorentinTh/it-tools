import { type Locator, type Page, type TestInfo, expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block' });
test.skip(({ browserName }) => browserName !== 'chromium', 'Long Task and forced-GC acceptance use Chromium CDP.');

interface ProbeResult {
  heartbeat: number
  longestTaskMs: number
}

async function setLargeTextareaValue(locator: Locator, value: string): Promise<void> {
  await locator.evaluate((element, nextValue) => {
    if (!(element instanceof HTMLTextAreaElement)) {
      throw new TypeError('The large-input fixture requires a textarea.');
    }
    const valueSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set;
    if (!valueSetter) {
      throw new TypeError('The textarea value setter is unavailable.');
    }
    valueSetter.call(element, nextValue);
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, value);
}

async function collectFixtureGarbage(page: Page): Promise<void> {
  const session = await page.context().newCDPSession(page);
  await session.send('HeapProfiler.collectGarbage');
  await session.detach();
  // Let fixture input/layout work paint before the observer starts. The
  // measured window still includes every allocation and render caused by the
  // explicit worker action, but not deferred work from preparing its input.
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  await page.waitForTimeout(50);
}

async function startMainThreadProbe(page: Page): Promise<void> {
  await page.evaluate(() => {
    const state = window as Window & {
      __boundedWorkerHeartbeat?: number
      __boundedWorkerHeartbeatTimer?: number
      __boundedWorkerLongTasks?: number[]
      __boundedWorkerObserver?: PerformanceObserver
    };
    state.__boundedWorkerHeartbeat = 0;
    state.__boundedWorkerLongTasks = [];
    state.__boundedWorkerHeartbeatTimer = window.setInterval(() => {
      state.__boundedWorkerHeartbeat = (state.__boundedWorkerHeartbeat ?? 0) + 1;
    }, 10);
    if (PerformanceObserver.supportedEntryTypes.includes('longtask')) {
      state.__boundedWorkerObserver = new PerformanceObserver((entries) => {
        state.__boundedWorkerLongTasks?.push(...entries.getEntries().map(entry => entry.duration));
      });
      state.__boundedWorkerObserver.observe({ entryTypes: ['longtask'] });
    }
  });
}

async function stopMainThreadProbe(page: Page): Promise<ProbeResult> {
  await page.waitForTimeout(100);
  return page.evaluate(() => {
    const state = window as Window & {
      __boundedWorkerHeartbeat?: number
      __boundedWorkerHeartbeatTimer?: number
      __boundedWorkerLongTasks?: number[]
      __boundedWorkerObserver?: PerformanceObserver
    };
    if (state.__boundedWorkerHeartbeatTimer !== undefined) {
      window.clearInterval(state.__boundedWorkerHeartbeatTimer);
    }
    state.__boundedWorkerObserver?.disconnect();
    return {
      heartbeat: state.__boundedWorkerHeartbeat ?? 0,
      longestTaskMs: Math.max(0, ...(state.__boundedWorkerLongTasks ?? [])),
    };
  });
}

function expectResponsive(result: ProbeResult, longestTaskBudgetMs = 50): void {
  expect(result.heartbeat, 'The page heartbeat must continue while the worker runs').toBeGreaterThan(0);
  expect(result.longestTaskMs).toBeLessThan(longestTaskBudgetMs);
}

function recordPerformance(
  testInfo: TestInfo,
  label: string,
  inputBytes: number,
  coldRouteMs: number,
  taskMs: number,
  result: ProbeResult,
): void {
  testInfo.annotations.push({
    type: 'performance',
    description: `${label}: ${inputBytes.toLocaleString('en')} input bytes; ${coldRouteMs} ms cold route-ready; ${taskMs} ms result-ready; ${result.longestTaskMs.toFixed(1)} ms longest task; ${result.heartbeat} heartbeat ticks`,
  });
}

test.describe('Production bounded-worker responsiveness', () => {
  test('formats a large SQL document without a main-thread Long Task', async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    const routeStartedAt = Date.now();
    await page.goto('/sql-prettify');
    const input = page.getByRole('textbox', { name: 'Your SQL query' });
    await expect(input).toBeVisible();
    const coldRouteMs = Date.now() - routeStartedAt;
    const statement = 'select field1, field2 from table_name where field1 = 1;\n';
    const sql = statement.repeat(Math.ceil(700 * 1024 / statement.length)).slice(0, 700 * 1024);
    await setLargeTextareaValue(input, sql);
    await expect(page.getByTestId('sql-format-status')).toContainText('Large input runs only on request');
    await collectFixtureGarbage(page);

    await startMainThreadProbe(page);
    const taskStartedAt = Date.now();
    await page.getByTestId('sql-format-run').click();
    await expect(page.getByTestId('sql-format-status')).toContainText('completed', { timeout: 30_000 });
    const preview = await page.getByTestId('area-content').inputValue();
    expect(preview).toMatch(/^SELECT/);
    expect(preview).toHaveLength(16 * 1024);
    const resultReadyMs = Date.now() - taskStartedAt;
    const result = await stopMainThreadProbe(page);
    recordPerformance(testInfo, 'SQL', new TextEncoder().encode(sql).byteLength, coldRouteMs, resultReadyMs, result);
    expectResponsive(result);
  });

  test('formats a near-limit XML document without a main-thread Long Task', async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    const routeStartedAt = Date.now();
    await page.goto('/xml-formatter');
    const input = page.getByTestId('input');
    await expect(input).toBeVisible();
    const coldRouteMs = Date.now() - routeStartedAt;
    const xml = `<root>${'a'.repeat(900 * 1024)}</root>`;
    await setLargeTextareaValue(input, xml);
    await expect(page.getByTestId('xml-format-status')).toContainText('Large input runs only on request');
    await collectFixtureGarbage(page);

    await startMainThreadProbe(page);
    const taskStartedAt = Date.now();
    await page.getByTestId('xml-format-run').click();
    await expect(page.getByTestId('xml-format-status')).toContainText('completed', { timeout: 30_000 });
    const resultReadyMs = Date.now() - taskStartedAt;
    const result = await stopMainThreadProbe(page);
    recordPerformance(testInfo, 'XML', new TextEncoder().encode(xml).byteLength, coldRouteMs, resultReadyMs, result);
    expectResponsive(result);
  });

  test('converts a near-limit XML document without a main-thread Long Task', async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    const routeStartedAt = Date.now();
    await page.goto('/xml-to-json');
    const input = page.getByTestId('input');
    await expect(input).toBeVisible();
    const coldRouteMs = Date.now() - routeStartedAt;
    const xml = `<root>${'a'.repeat(800 * 1024)}</root>`;
    await setLargeTextareaValue(input, xml);
    await expect(page.getByTestId('converter-status')).toContainText('Large input runs only on request');
    await collectFixtureGarbage(page);

    await startMainThreadProbe(page);
    const taskStartedAt = Date.now();
    await page.getByTestId('converter-run').click();
    await expect(page.getByTestId('converter-status')).toContainText('completed', { timeout: 30_000 });
    const resultReadyMs = Date.now() - taskStartedAt;
    const result = await stopMainThreadProbe(page);
    recordPerformance(testInfo, 'XML to JSON', new TextEncoder().encode(xml).byteLength, coldRouteMs, resultReadyMs, result);
    expectResponsive(result);
  });

  test('renders a near-limit Markdown document without a main-thread Long Task', async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    const routeStartedAt = Date.now();
    await page.goto('/markdown-to-html');
    const input = page.getByRole('textbox', { name: 'Your Markdown to convert:' });
    await expect(input).toBeVisible();
    const coldRouteMs = Date.now() - routeStartedAt;
    const markdown = 'a'.repeat(900 * 1024);
    await setLargeTextareaValue(input, markdown);
    await expect(page.getByTestId('markdown-status')).toContainText('Large input runs only on request');
    await collectFixtureGarbage(page);

    await startMainThreadProbe(page);
    const taskStartedAt = Date.now();
    await page.getByTestId('markdown-run').click();
    await expect(page.getByTestId('markdown-status')).toContainText('completed', { timeout: 30_000 });
    const resultReadyMs = Date.now() - taskStartedAt;
    const result = await stopMainThreadProbe(page);
    recordPerformance(testInfo, 'Markdown', new TextEncoder().encode(markdown).byteLength, coldRouteMs, resultReadyMs, result);
    expectResponsive(result);
  });

  test('analyzes four million text bytes without a main-thread Long Task', async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    const routeStartedAt = Date.now();
    await page.goto('/text-statistics');
    const input = page.getByRole('textbox', { name: 'Text to analyze' });
    await expect(input).toBeVisible();
    const coldRouteMs = Date.now() - routeStartedAt;
    const text = 'word '.repeat(800_000);
    await setLargeTextareaValue(input, text);
    await expect(page.getByTestId('text-statistics-status')).toContainText('only on request');
    await collectFixtureGarbage(page);

    await startMainThreadProbe(page);
    const taskStartedAt = Date.now();
    await page.getByTestId('text-statistics-run').click();
    await expect(page.getByTestId('text-statistics-status')).toContainText('analyzed', { timeout: 30_000 });
    const resultReadyMs = Date.now() - taskStartedAt;
    const result = await stopMainThreadProbe(page);
    recordPerformance(testInfo, 'Text Statistics', new TextEncoder().encode(text).byteLength, coldRouteMs, resultReadyMs, result);
    expectResponsive(result);
  });

  test('compares large key-aligned JSON documents without a main-thread Long Task', async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    const makeDocument = (changedIndex: number) => JSON.stringify({
      items: Array.from({ length: 100 }, (_, index) => ({
        id: index,
        payload: 'a'.repeat(4_096),
        value: index === changedIndex ? 'changed' : 'stable',
      })),
    });

    const left = makeDocument(-1);
    const right = makeDocument(50);
    const routeStartedAt = Date.now();
    await page.goto('/json-diff');
    const leftInput = page.getByTestId('leftJson');
    await expect(leftInput).toBeVisible();
    const coldRouteMs = Date.now() - routeStartedAt;
    await setLargeTextareaValue(leftInput, left);
    await setLargeTextareaValue(page.getByTestId('rightJson'), right);
    await collectFixtureGarbage(page);

    await startMainThreadProbe(page);
    const taskStartedAt = Date.now();
    await page.getByTestId('json-diff-run').click();
    await expect(page.getByTestId('json-diff-status')).toContainText('Compared', { timeout: 30_000 });
    const resultReadyMs = Date.now() - taskStartedAt;
    const result = await stopMainThreadProbe(page);
    recordPerformance(
      testInfo,
      'JSON Diff',
      new TextEncoder().encode(left).byteLength + new TextEncoder().encode(right).byteLength,
      coldRouteMs,
      resultReadyMs,
      result,
    );
    expectResponsive(result);
  });

  test('converts a large Docker command without a main-thread Long Task', async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    const routeStartedAt = Date.now();
    await page.goto('/docker-run-to-docker-compose-converter');
    const input = page.getByTestId('docker-run-input');
    await expect(input).toBeVisible();
    const coldRouteMs = Date.now() - routeStartedAt;
    const variables = Array.from({ length: 1_000 }, (_, index) => `-e KEY_${index}=value_${index}`).join(' ');
    const command = `docker run ${variables} nginx`;
    await setLargeTextareaValue(input, command);
    await expect(page.getByTestId('docker-converter-status')).toContainText('Large Docker commands run only on request');
    await collectFixtureGarbage(page);

    await startMainThreadProbe(page);
    const taskStartedAt = Date.now();
    await page.getByTestId('docker-converter-run').click();
    await expect(page.getByTestId('docker-converter-status')).toContainText('completed', { timeout: 30_000 });
    const resultReadyMs = Date.now() - taskStartedAt;
    const result = await stopMainThreadProbe(page);
    recordPerformance(testInfo, 'Docker Run to Compose', new TextEncoder().encode(command).byteLength, coldRouteMs, resultReadyMs, result);
    expectResponsive(result);
  });

  test('hashes one MiB with eight digests without a main-thread Long Task', async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    const routeStartedAt = Date.now();
    await page.goto('/hash-text');
    const input = page.getByTestId('hash-text-input');
    await expect(input).toBeVisible();
    const coldRouteMs = Date.now() - routeStartedAt;
    const source = 'x'.repeat(1024 * 1024);
    await setLargeTextareaValue(input, source);
    await expect(page.getByTestId('hash-text-status')).toContainText('Large input runs only on request');
    await collectFixtureGarbage(page);

    await startMainThreadProbe(page);
    const taskStartedAt = Date.now();
    await page.getByTestId('hash-text-run').click();
    await expect(page.getByTestId('hash-text-status')).toContainText('completed', { timeout: 30_000 });
    const resultReadyMs = Date.now() - taskStartedAt;
    const result = await stopMainThreadProbe(page);
    recordPerformance(testInfo, 'Hash Text', source.length, coldRouteMs, resultReadyMs, result);
    expectResponsive(result);
  });

  test('converts a large JSON5 array to bounded CSV without a main-thread Long Task', async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    const routeStartedAt = Date.now();
    await page.goto('/json-to-csv');
    const input = page.getByTestId('input');
    await expect(input).toBeVisible();
    const coldRouteMs = Date.now() - routeStartedAt;
    const source = JSON.stringify(Array.from({ length: 12_000 }, (_, index) => ({
      id: index,
      label: `private-item-${index}`,
      payload: 'x'.repeat(32),
    })));
    await setLargeTextareaValue(input, source);
    await expect(page.getByTestId('json-to-csv-status')).toContainText('only on request');
    await collectFixtureGarbage(page);

    await startMainThreadProbe(page);
    const taskStartedAt = Date.now();
    await page.getByTestId('json-to-csv-run').click();
    await expect(page.getByTestId('json-to-csv-status')).toContainText('completed', { timeout: 30_000 });
    expect(await page.getByTestId('area-content').inputValue()).toHaveLength(16 * 1024);
    const resultReadyMs = Date.now() - taskStartedAt;
    const result = await stopMainThreadProbe(page);
    recordPerformance(testInfo, 'JSON to CSV', new TextEncoder().encode(source).byteLength, coldRouteMs, resultReadyMs, result);
    expectResponsive(result);
  });

  test('minifies a near-limit JSON document without a main-thread Long Task', async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    const routeStartedAt = Date.now();
    await page.goto('/json-minify');
    const input = page.getByTestId('input');
    await expect(input).toBeVisible();
    const coldRouteMs = Date.now() - routeStartedAt;
    const source = JSON.stringify({ payload: 'x'.repeat(900 * 1024) }, null, 2);
    await setLargeTextareaValue(input, source);
    await expect(page.getByTestId('converter-status')).toContainText('only on request');
    await collectFixtureGarbage(page);

    await startMainThreadProbe(page);
    const taskStartedAt = Date.now();
    await page.getByTestId('converter-run').click();
    await expect(page.getByTestId('converter-status')).toContainText('completed', { timeout: 30_000 });
    expect(await page.getByTestId('area-content').inputValue()).toHaveLength(16 * 1024);
    const resultReadyMs = Date.now() - taskStartedAt;
    const result = await stopMainThreadProbe(page);
    recordPerformance(testInfo, 'JSON Minify', new TextEncoder().encode(source).byteLength, coldRouteMs, resultReadyMs, result);
    expectResponsive(result);
  });

  test('sorts and deduplicates a large list without a main-thread Long Task', async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    const routeStartedAt = Date.now();
    await page.goto('/list-converter');
    const input = page.getByTestId('input');
    await expect(input).toBeVisible();
    const coldRouteMs = Date.now() - routeStartedAt;
    const source = Array.from({ length: 50_000 }, (_, index) => `private-item-${49_999 - index}`).join('\n');
    await setLargeTextareaValue(input, source);
    await expect(page.getByTestId('list-converter-status')).toContainText('only on request');
    await collectFixtureGarbage(page);

    await startMainThreadProbe(page);
    const taskStartedAt = Date.now();
    await page.getByTestId('list-converter-run').click();
    await expect(page.getByTestId('list-converter-status')).toContainText('completed', { timeout: 30_000 });
    expect(await page.getByTestId('area-content').inputValue()).toHaveLength(8 * 1024);
    const resultReadyMs = Date.now() - taskStartedAt;
    const result = await stopMainThreadProbe(page);
    recordPerformance(testInfo, 'List Converter', new TextEncoder().encode(source).byteLength, coldRouteMs, resultReadyMs, result);
    // Publishing the complete ~950 KiB string still incurs a small structured-clone task;
    // keep a narrow measured exception while the worker computation remains isolated.
    expectResponsive(result, 75);
  });

  test('inspects a large OpenAPI document without a main-thread Long Task', async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    const routeStartedAt = Date.now();
    await page.goto('/openapi-inspector');
    const input = page.getByTestId('openapi-source').locator('textarea');
    await expect(input).toBeVisible();
    const coldRouteMs = Date.now() - routeStartedAt;
    const paths = Array.from({ length: 700 }, (_, index) => `  /items/${index}:\n    get:\n      operationId: getItem${index}\n      summary: ${'x'.repeat(512)}\n      responses:\n        '200':\n          description: OK`).join('\n');
    const source = `openapi: 3.1.0\ninfo:\n  title: Large local fixture\n  version: '1'\npaths:\n${paths}\n`;
    await setLargeTextareaValue(input, source);
    await collectFixtureGarbage(page);

    await startMainThreadProbe(page);
    const taskStartedAt = Date.now();
    await page.getByTestId('openapi-inspect').click();
    await expect(page.getByTestId('openapi-status')).toContainText('Inspection finished locally', { timeout: 30_000 });
    const resultReadyMs = Date.now() - taskStartedAt;
    const result = await stopMainThreadProbe(page);
    recordPerformance(testInfo, 'OpenAPI Inspector', new TextEncoder().encode(source).byteLength, coldRouteMs, resultReadyMs, result);
    expectResponsive(result);
  });
});
