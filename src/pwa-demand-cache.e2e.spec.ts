import { type Page, expect, test } from '@playwright/test';

const RUNTIME_CACHE_NAME = 'it-tools-lazy-assets-v1';
const STATIC_SHELL_PATHS = [
  '/index.html',
  '/manifest.webmanifest',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
];

interface CacheSnapshot {
  entries: string[]
  name: string
}

async function waitForServiceWorkerController(page: Page) {
  await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service workers are unavailable');
    }

    await navigator.serviceWorker.ready;

    if (navigator.serviceWorker.controller) {
      return;
    }

    await new Promise<void>((resolve, reject) => {
      let timeout: number;
      const handleControllerChange = () => {
        if (!navigator.serviceWorker.controller) {
          return;
        }

        window.clearTimeout(timeout);
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
        resolve();
      };
      timeout = window.setTimeout(() => {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
        reject(new Error('The production service worker did not take control'));
      }, 15_000);

      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
    });
  });
}

async function getCacheSnapshots(page: Page) {
  return page.evaluate(async (): Promise<CacheSnapshot[]> => Promise.all(
    (await caches.keys()).map(async name => ({
      name,
      entries: (await (await caches.open(name)).keys())
        .map(request => new URL(request.url).pathname)
        .sort(),
    })),
  ));
}

test.describe('PWA demand-driven caching', () => {
  test('precaches only the shell and reloads an opened lazy tool offline', async ({ browserName, context, page }, testInfo) => {
    test.skip(browserName !== 'chromium', 'CacheStorage and offline behavior are gated in Chromium.');

    const chunkErrors: string[] = [];
    const offlineResponses = new Map<string, boolean>();
    let offline = false;

    page.on('pageerror', error => chunkErrors.push(`pageerror: ${error.message}`));
    page.on('console', (message) => {
      if (message.type() === 'error' && /chunk|dynamically imported|module script/i.test(message.text())) {
        chunkErrors.push(`console: ${message.text()}`);
      }
    });
    page.on('requestfailed', (request) => {
      if (request.resourceType() === 'script' && new URL(request.url()).pathname.startsWith('/assets/')) {
        chunkErrors.push(`script request failed: ${request.url()} (${request.failure()?.errorText ?? 'unknown'})`);
      }
    });
    page.on('response', (response) => {
      if (offline) {
        offlineResponses.set(new URL(response.url()).pathname, response.fromServiceWorker());
      }
    });

    const controllerStartedAt = Date.now();
    await page.goto('/');
    await waitForServiceWorkerController(page);
    const controllerReadyMs = Date.now() - controllerStartedAt;

    const shellAssetPaths = await page.locator(
      'script[src], link[rel="stylesheet"][href], link[rel="modulepreload"][href], link[rel="preload"][href]',
    ).evaluateAll(elements => [...new Set(elements.map((element) => {
      if (element instanceof HTMLScriptElement) {
        return new URL(element.src).pathname;
      }

      if (element instanceof HTMLLinkElement) {
        return new URL(element.href).pathname;
      }

      throw new TypeError(`Unexpected shell resource element: ${element.tagName}`);
    }))].sort());
    const initialCaches = await getCacheSnapshots(page);
    const precache = initialCaches.find(cache => cache.name.startsWith('workbox-precache'));
    const clientRuntimePaths = precache?.entries.filter(
      path => /^\/assets\/workbox-window[^/]*\.js$/.test(path),
    ) ?? [];
    const offlineRecoveryPaths = precache?.entries.filter(
      path => /^\/assets\/OfflineRouteUnavailable-[^/]*\.js$/.test(path),
    ) ?? [];

    expect(precache, 'Workbox precache should exist after service-worker activation').toBeDefined();
    expect(clientRuntimePaths).toHaveLength(1);
    expect(offlineRecoveryPaths).toHaveLength(1);
    expect(precache?.entries).toEqual([...STATIC_SHELL_PATHS, ...shellAssetPaths, ...offlineRecoveryPaths, ...clientRuntimePaths].sort());
    expect(precache?.entries.filter(path => path.startsWith('/assets/')))
      .toEqual([...shellAssetPaths, ...offlineRecoveryPaths, ...clientRuntimePaths].sort());
    expect(initialCaches.find(cache => cache.name === RUNTIME_CACHE_NAME)?.entries ?? []).toEqual([]);

    const toolLoadStartedAt = Date.now();
    await page.locator('a[href="/random-port-generator"]').first().click();
    await expect(page).toHaveURL(/\/random-port-generator$/);
    await expect(page).toHaveTitle('Random port generator - IT Tools');
    await expect(page.getByTestId('random-port-output')).toBeVisible();
    const onlineToolLoadMs = Date.now() - toolLoadStartedAt;

    const lazyAssetPaths = await page.evaluate(precachePaths => [...new Set(
      performance.getEntriesByType('resource')
        .map(entry => new URL(entry.name).pathname)
        .filter(path => /^\/assets\/.+\.(?:css|js)$/.test(path) && !precachePaths.includes(path)),
    )].sort(), precache?.entries ?? []);

    expect(lazyAssetPaths.length, 'The tool route should load at least one non-shell asset').toBeGreaterThan(0);

    await expect.poll(async () => {
      const runtimeCache = (await getCacheSnapshots(page)).find(cache => cache.name === RUNTIME_CACHE_NAME);
      return runtimeCache?.entries ?? [];
    }).toEqual(lazyAssetPaths);

    const runtimeCache = (await getCacheSnapshots(page)).find(cache => cache.name === RUNTIME_CACHE_NAME);
    expect(runtimeCache?.entries).toEqual(lazyAssetPaths);
    expect(runtimeCache?.entries.some(path => shellAssetPaths.includes(path))).toBe(false);

    const cdpSession = await context.newCDPSession(page);
    await cdpSession.send('Network.enable');
    await cdpSession.send('Network.clearBrowserCache');
    await cdpSession.detach();

    offline = true;
    await context.setOffline(true);
    const offlineReloadStartedAt = Date.now();
    const navigationResponse = await page.reload({ waitUntil: 'domcontentloaded' });

    expect(navigationResponse?.fromServiceWorker()).toBe(true);
    await expect(page).toHaveTitle('Random port generator - IT Tools');
    await expect(page.getByTestId('random-port-output')).toBeVisible();
    const offlineReloadMs = Date.now() - offlineReloadStartedAt;

    for (const path of [...clientRuntimePaths, ...lazyAssetPaths]) {
      expect(offlineResponses.get(path), `${path} should be served by the service worker while offline`).toBe(true);
    }
    expect([...offlineResponses.values()].every(Boolean), 'Every resource requested offline should come from the service worker').toBe(true);

    expect(chunkErrors, chunkErrors.join('\n')).toEqual([]);

    const evidence = {
      cacheEntries: {
        precache: precache?.entries,
        runtime: runtimeCache?.entries,
      },
      timingsMs: {
        controllerReady: controllerReadyMs,
        offlineReload: offlineReloadMs,
        onlineToolLoad: onlineToolLoadMs,
      },
    };

    testInfo.annotations.push({
      type: 'pwa-cache-evidence',
      description: JSON.stringify(evidence),
    });
    await testInfo.attach('pwa-cache-evidence.json', {
      body: JSON.stringify(evidence, null, 2),
      contentType: 'application/json',
    });
  });
});
