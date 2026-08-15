import { type Page, expect, test } from '@playwright/test';

async function waitForServiceWorkerController(page: Page) {
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (navigator.serviceWorker.controller) {
      return;
    }

    await new Promise<void>((resolve, reject) => {
      const timeout = window.setTimeout(
        () => reject(new Error('The production service worker did not take control.')),
        15_000,
      );
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.clearTimeout(timeout);
        resolve();
      }, { once: true });
    });
  });
}

test.describe('PWA offline route recovery', () => {
  test('replaces the previous route when an uncached tool fails and retries after reconnecting', async ({ browserName, context, page }) => {
    test.skip(browserName !== 'chromium', 'Production service-worker recovery is gated in Chromium.');

    const runtimeErrors: string[] = [];
    const failedAssetPaths: string[] = [];
    page.on('pageerror', error => runtimeErrors.push(`pageerror: ${error.message}`));
    page.on('console', (message) => {
      if (message.type() === 'error' && !/failed to load resource/i.test(message.text())) {
        runtimeErrors.push(`console: ${message.text()}`);
      }
    });
    page.on('requestfailed', (request) => {
      const path = new URL(request.url()).pathname;
      if (path.startsWith('/assets/')) {
        failedAssetPaths.push(path);
      }
    });

    await page.goto('/');
    await waitForServiceWorkerController(page);

    const targetAssetPath = await page.evaluate(async () => {
      const manifest = await fetch('/manifest.json').then(response => response.json()) as Record<string, { file?: unknown }>;
      const file = manifest['src/tools/percentage-calculator/percentage-calculator.vue']?.file;
      if (typeof file !== 'string') {
        throw new TypeError('Percentage Calculator is missing from the production manifest.');
      }

      return `/${file}`;
    });

    await page.locator('a[href="/random-port-generator"]').first().click();
    await expect(page).toHaveURL(/\/random-port-generator$/);
    await expect(page.getByTestId('random-port-output')).toBeVisible();

    const runtimeEntries = await page.evaluate(async () => {
      const cache = await caches.open('it-tools-lazy-assets-v1');
      return (await cache.keys()).map(request => new URL(request.url).pathname);
    });
    expect(runtimeEntries.length).toBeGreaterThan(0);
    expect(runtimeEntries).not.toContain(targetAssetPath);

    const serviceWorker = context.serviceWorkers()
      .find(worker => new URL(worker.url()).pathname === '/sw.js');
    expect(serviceWorker, 'The production Workbox service worker should be running').toBeDefined();
    await serviceWorker?.evaluate((blockedAssetPath) => {
      const originFetch = globalThis.fetch.bind(globalThis);
      let blockedOnce = false;

      globalThis.fetch = async (input, init) => {
        const requestUrl = new Request(input, init).url;
        if (!blockedOnce && new URL(requestUrl).pathname === blockedAssetPath) {
          blockedOnce = true;
          throw new TypeError('Simulated offline cache miss');
        }

        return originFetch(input, init);
      };
    }, targetAssetPath);

    const cdpSession = await context.newCDPSession(page);
    await cdpSession.send('Network.enable');
    await cdpSession.send('Network.clearBrowserCache');
    await cdpSession.detach();

    await context.setOffline(true);
    await page.locator('a[href="/percentage-calculator"]').first().click();

    const recovery = page.getByTestId('offline-route-unavailable');
    await expect(recovery).toBeVisible();
    await expect(recovery).toContainText('/percentage-calculator');
    await expect(page.getByTestId('retry-offline-route')).toBeDisabled();
    await expect(page).toHaveURL(/\/random-port-generator$/);
    await expect(page.getByTestId('random-port-output')).toHaveCount(0);
    await expect(page.getByText('What is', { exact: true })).toHaveCount(0);
    expect(failedAssetPaths).toContain(targetAssetPath);

    await context.setOffline(false);
    await expect(page.getByTestId('retry-offline-route')).toBeEnabled();
    await page.getByTestId('retry-offline-route').click();

    await expect(page).toHaveURL(/\/percentage-calculator$/);
    await expect(page).toHaveTitle('Percentage calculator - IT Tools');
    await expect(page.getByTestId('percentageX')).toBeVisible();
    await expect(recovery).toBeHidden();

    await expect.poll(async () => page.evaluate(async (targetPath) => {
      const cache = await caches.open('it-tools-lazy-assets-v1');
      return (await cache.keys()).some(request => new URL(request.url).pathname === targetPath);
    }, targetAssetPath)).toBe(true);

    expect(runtimeErrors).toEqual([]);
  });
});
