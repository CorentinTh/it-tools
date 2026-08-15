import { execFile } from 'node:child_process';
import { Buffer } from 'node:buffer';
import { mkdtemp, open, rm } from 'node:fs/promises';
import { platform, tmpdir } from 'node:os';
import { join } from 'node:path';
import { type CDPSession, expect, test } from '@playwright/test';

const LARGE_FILE_BYTES = 256 * 1024 * 1024;
const MAX_RETAINED_RENDERER_HEAP_BYTES = 32 * 1024 * 1024;
// Page heap/backing-storage limits are the primary clone guard. Process RSS
// also includes Chromium's fresh worker/process overhead, which varies between
// otherwise identical runs; three quarters of the fixture still rejects a
// sustained 256 MiB whole-file clone without treating that overhead as data.
const MAX_PEAK_BROWSER_RSS_DELTA_BYTES = LARGE_FILE_BYTES * 3 / 4;
const MAX_PEAK_PAGE_MEMORY_DELTA_BYTES = 32 * 1024 * 1024;
const ABC_SHA_256 = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';

let fixtureDirectory = '';
let fixturePath = '';

interface PageMemorySample {
  backingStorageSize?: number
  usedSize: number
}

function parsePageMemorySample(value: unknown): PageMemorySample {
  if (
    typeof value !== 'object'
    || value === null
    || !('usedSize' in value)
    || typeof value.usedSize !== 'number'
    || !Number.isFinite(value.usedSize)
    || value.usedSize < 0
  ) {
    throw new TypeError('Chromium returned invalid page heap usage.');
  }

  const backingStorageSize = 'backingStorageSize' in value
    && typeof value.backingStorageSize === 'number'
    && Number.isFinite(value.backingStorageSize)
    && value.backingStorageSize >= 0
    ? value.backingStorageSize
    : undefined;

  return { usedSize: value.usedSize, backingStorageSize };
}

async function readPageMemory(session: CDPSession): Promise<PageMemorySample> {
  const value: unknown = await session.send('Runtime.getHeapUsage');
  return parsePageMemorySample(value);
}

function readProcessRssBytes(processIds: number[]): Promise<number> {
  return new Promise((resolve, reject) => {
    execFile(
      'ps',
      ['-o', 'rss=', '-p', processIds.join(',')],
      { encoding: 'utf8' },
      (error, stdout) => {
        if (error) {
          reject(error);
          return;
        }

        const rssKiB = stdout
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .map(Number);
        if (rssKiB.length === 0 || rssKiB.some(value => !Number.isSafeInteger(value) || value < 1)) {
          reject(new TypeError('Chromium process RSS could not be measured.'));
          return;
        }
        resolve(rssKiB.reduce((total, value) => total + value, 0) * 1024);
      },
    );
  });
}

async function readChromiumProcessRssBytes(session: CDPSession): Promise<number | undefined> {
  if (platform() === 'win32') {
    return undefined;
  }

  const { processInfo } = await session.send('SystemInfo.getProcessInfo');
  const processIds = [...new Set(
    processInfo
      .filter(({ type }) => type !== 'zygote')
      .map(({ id }) => id)
      .filter(id => Number.isSafeInteger(id) && id > 0),
  )];
  if (processIds.length === 0) {
    throw new TypeError('Chromium did not expose any measurable processes.');
  }
  return readProcessRssBytes(processIds);
}

test.use({ serviceWorkers: 'block' });

test.describe('Tool - File hash bounded worker', () => {
  test.beforeAll(async () => {
    fixtureDirectory = await mkdtemp(join(tmpdir(), 'it-tools-file-hash-'));
    fixturePath = join(fixtureDirectory, '256-mib-zero-fixture.bin');
    const fixture = await open(fixturePath, 'w');
    try {
      await fixture.truncate(LARGE_FILE_BYTES);
    }
    finally {
      await fixture.close();
    }
  });

  test.afterAll(async () => {
    if (fixtureDirectory) {
      await rm(fixtureDirectory, { recursive: true, force: true });
    }
  });

  test('hashes 256 MiB responsively, reports progress, and hard-cancels a repeat run', async ({ browser, page, browserName }, testInfo) => {
    test.skip(browserName !== 'chromium', 'Chromium is the mandatory large-file performance baseline.');
    test.setTimeout(60_000);

    const runtimeErrors: string[] = [];
    page.on('pageerror', error => runtimeErrors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') {
        runtimeErrors.push(message.text());
      }
    });

    await page.addInitScript(() => {
      const NativeWorker = window.Worker;
      let activeWorkers = 0;

      class TrackedWorker extends NativeWorker {
        private wasTerminated = false;

        constructor(scriptURL: string | URL, options?: WorkerOptions) {
          super(scriptURL, options);
          activeWorkers += 1;
        }

        override terminate(): void {
          if (!this.wasTerminated) {
            this.wasTerminated = true;
            activeWorkers -= 1;
          }
          super.terminate();
        }
      }

      Object.defineProperty(window, 'Worker', {
        configurable: true,
        value: TrackedWorker,
        writable: true,
      });
      Object.defineProperty(window, '__fileHashActiveWorkers', {
        configurable: true,
        get: () => activeWorkers,
      });
    });

    const coldRouteStartedAt = Date.now();
    await page.goto('/file-hash');
    await expect(page).toHaveTitle('File hash - IT Tools');
    const coldRouteReadyMs = Date.now() - coldRouteStartedAt;

    const input = page.getByTestId('file-hash-upload').locator('input[type="file"]');
    await input.setInputFiles(fixturePath);
    await page.getByTestId('file-hash-algorithm-SHA-384').click();
    await page.getByTestId('file-hash-algorithm-SHA-512').click();

    const session = await page.context().newCDPSession(page);
    const browserSession = await browser.newBrowserCDPSession();
    await session.send('HeapProfiler.collectGarbage');
    const heapBefore = await readPageMemory(session);
    const browserRssBefore = await readChromiumProcessRssBytes(browserSession);
    let peakPageHeapBytes = heapBefore.usedSize;
    let peakPageBackingStorageBytes = heapBefore.backingStorageSize;
    let peakBrowserRssBytes = browserRssBefore;
    const supportsLongTasks = await page.evaluate(() => PerformanceObserver.supportedEntryTypes.includes('longtask'));

    await page.evaluate(() => {
      const state = window as Window & {
        __fileHashHeartbeat?: number
        __fileHashHeartbeatTimer?: number
        __fileHashLongTasks?: number[]
        __fileHashProgressValues?: string[]
      };
      state.__fileHashHeartbeat = 0;
      state.__fileHashLongTasks = [];
      state.__fileHashProgressValues = [];
      state.__fileHashHeartbeatTimer = window.setInterval(() => {
        state.__fileHashHeartbeat = (state.__fileHashHeartbeat ?? 0) + 1;
      }, 10);

      let previousProgress = '';
      const captureProgress = () => {
        const current = document.querySelector('[data-test-id="file-hash-progress-bytes"]')?.textContent ?? '';
        if (current && current !== previousProgress) {
          previousProgress = current;
          state.__fileHashProgressValues?.push(current);
        }
      };
      new MutationObserver(captureProgress).observe(document.body, {
        childList: true,
        characterData: true,
        subtree: true,
      });

      if (PerformanceObserver.supportedEntryTypes.includes('longtask')) {
        const observer = new PerformanceObserver((entries) => {
          state.__fileHashLongTasks?.push(...entries.getEntries().map(({ duration }) => duration));
        });
        observer.observe({ entryTypes: ['longtask'] });
      }
    });

    let sampleMemory = true;
    const memorySampling = (async function sampleMemoryUntilStopped(): Promise<void> {
      if (!sampleMemory) {
        return;
      }

      const [pageMemory, browserRss] = await Promise.all([
        readPageMemory(session),
        readChromiumProcessRssBytes(browserSession),
      ]);
      peakPageHeapBytes = Math.max(peakPageHeapBytes, pageMemory.usedSize);
      if (pageMemory.backingStorageSize !== undefined) {
        peakPageBackingStorageBytes = Math.max(
          peakPageBackingStorageBytes ?? 0,
          pageMemory.backingStorageSize,
        );
      }
      if (browserRss !== undefined) {
        peakBrowserRssBytes = Math.max(peakBrowserRssBytes ?? 0, browserRss);
      }
      await new Promise(resolve => setTimeout(resolve, 25));
      return sampleMemoryUntilStopped();
    })();

    const hashingStartedAt = Date.now();
    try {
      await page.getByTestId('file-hash-run').click();
      await expect(page.getByTestId('file-hash-status')).toContainText('Hashing completed', { timeout: 30_000 });
    }
    finally {
      sampleMemory = false;
      await memorySampling;
    }
    await page.waitForTimeout(50);
    const hashingReadyMs = Date.now() - hashingStartedAt;

    await session.send('HeapProfiler.collectGarbage');
    const heapAfter = await readPageMemory(session);
    await session.detach();
    await browserSession.detach();

    const measurements = await page.evaluate(() => {
      const state = window as Window & {
        __fileHashActiveWorkers?: number
        __fileHashHeartbeat?: number
        __fileHashHeartbeatTimer?: number
        __fileHashLongTasks?: number[]
        __fileHashProgressValues?: string[]
      };
      if (state.__fileHashHeartbeatTimer !== undefined) {
        window.clearInterval(state.__fileHashHeartbeatTimer);
      }
      return {
        activeWorkers: state.__fileHashActiveWorkers ?? -1,
        heartbeat: state.__fileHashHeartbeat ?? 0,
        longestTaskMs: Math.max(0, ...(state.__fileHashLongTasks ?? [])),
        progressUpdates: state.__fileHashProgressValues?.length ?? 0,
      };
    });
    const retainedHeapDelta = Math.max(0, heapAfter.usedSize - heapBefore.usedSize);
    const peakPageHeapDelta = Math.max(0, peakPageHeapBytes - heapBefore.usedSize);
    const peakPageBackingStorageDelta = peakPageBackingStorageBytes === undefined
      || heapBefore.backingStorageSize === undefined
      ? undefined
      : Math.max(0, peakPageBackingStorageBytes - heapBefore.backingStorageSize);
    const peakBrowserRssDelta = peakBrowserRssBytes === undefined || browserRssBefore === undefined
      ? undefined
      : Math.max(0, peakBrowserRssBytes - browserRssBefore);

    testInfo.annotations.push({
      type: 'performance',
      description: `${coldRouteReadyMs} ms cold route; ${hashingReadyMs} ms for 256 MiB/all-3; ${measurements.longestTaskMs.toFixed(1)} ms longest task; ${retainedHeapDelta} B retained page heap; ${peakPageHeapDelta} B peak page heap delta; ${peakPageBackingStorageDelta ?? 'unsupported'} B peak page backing-storage delta; ${peakBrowserRssDelta ?? 'unsupported'} B peak Chromium RSS delta`,
    });

    expect(coldRouteReadyMs).toBeLessThan(3_000);
    expect(hashingReadyMs).toBeLessThan(20_000);
    expect(measurements.heartbeat, 'The main thread should stay responsive during file hashing').toBeGreaterThan(10);
    expect(measurements.progressUpdates, 'The worker should expose multiple bounded progress updates').toBeGreaterThan(1);
    expect(measurements.activeWorkers).toBe(0);
    expect(retainedHeapDelta).toBeLessThan(MAX_RETAINED_RENDERER_HEAP_BYTES);
    expect(peakPageHeapDelta).toBeLessThan(MAX_PEAK_PAGE_MEMORY_DELTA_BYTES);
    if (peakPageBackingStorageDelta !== undefined) {
      expect(peakPageBackingStorageDelta).toBeLessThan(MAX_PEAK_PAGE_MEMORY_DELTA_BYTES);
    }
    if (peakBrowserRssDelta !== undefined) {
      expect(peakBrowserRssDelta).toBeLessThan(MAX_PEAK_BROWSER_RSS_DELTA_BYTES);
    }
    if (supportsLongTasks) {
      expect(measurements.longestTaskMs).toBeLessThan(50);
    }

    await input.setInputFiles(fixturePath);
    await page.getByTestId('file-hash-run').click();
    const progressBytes = page.getByTestId('file-hash-progress-bytes');
    await expect.poll(async () => {
      const processed = Number(await progressBytes.getAttribute('data-bytes-processed'));
      const total = Number(await progressBytes.getAttribute('data-total-bytes'));
      return processed > 0 && processed < total;
    }).toBe(true);

    await input.setInputFiles({
      name: 'replacement.bin',
      mimeType: 'application/octet-stream',
      buffer: Buffer.from('abc'),
    });
    await expect(page.getByTestId('file-hash-name')).toHaveText('replacement.bin');
    await expect(page.getByTestId('file-hash-status')).toContainText('File selected');
    expect(await page.evaluate(() => (
      (window as Window & { __fileHashActiveWorkers?: number }).__fileHashActiveWorkers ?? -1
    ))).toBe(0);
    await page.getByTestId('file-hash-run').click();
    await expect(page.getByTestId('file-hash-result-SHA-256')).toHaveText(ABC_SHA_256);
    await page.waitForTimeout(200);
    await expect(page.getByTestId('file-hash-name')).toHaveText('replacement.bin');
    await expect(page.getByTestId('file-hash-result-SHA-256')).toHaveText(ABC_SHA_256);
    expect(await page.evaluate(() => (
      (window as Window & { __fileHashActiveWorkers?: number }).__fileHashActiveWorkers ?? -1
    ))).toBe(0);

    await input.setInputFiles(fixturePath);
    await page.getByTestId('file-hash-run').click();
    await expect.poll(async () => {
      const processed = Number(await progressBytes.getAttribute('data-bytes-processed'));
      const total = Number(await progressBytes.getAttribute('data-total-bytes'));
      return processed > 0 && processed < total;
    }).toBe(true);
    const cancelStartedAt = Date.now();
    await page.getByTestId('file-hash-cancel').click();
    await expect(page.getByTestId('file-hash-status')).toContainText('cancelled');
    const cancelReadyMs = Date.now() - cancelStartedAt;
    const activeWorkersAfterCancel = await page.evaluate(() => (
      (window as Window & { __fileHashActiveWorkers?: number }).__fileHashActiveWorkers ?? -1
    ));

    expect(cancelReadyMs).toBeLessThan(500);
    expect(activeWorkersAfterCancel).toBe(0);
    await page.waitForTimeout(200);
    await expect(page.getByTestId('file-hash-status')).toContainText('cancelled');
    await expect(page.getByTestId('file-hash-results')).toHaveCount(0);
    expect(runtimeErrors).toEqual([]);
  });
});
