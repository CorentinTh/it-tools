import { Buffer } from 'node:buffer';
import { type Page, expect, test } from '@playwright/test';

const ABC_SHA_256 = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
const RUNTIME_CACHE_NAME = 'it-tools-lazy-assets-v1';

async function waitForServiceWorkerController(page: Page): Promise<void> {
  await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service workers are unavailable.');
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
        reject(new Error('The production service worker did not take control.'));
      }, 15_000);
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
    });
  });
}

async function getRuntimeCachePaths(page: Page): Promise<string[]> {
  return page.evaluate(async cacheName => (
    await (await caches.open(cacheName)).keys()
  ).map(request => new URL(request.url).pathname).sort(), RUNTIME_CACHE_NAME);
}

test.describe('Tool - File hash PWA lifecycle', () => {
  test('demand-caches the route and worker, then hashes again offline', async ({ browserName, context, page }) => {
    test.skip(browserName !== 'chromium', 'Production service-worker behavior is gated in Chromium.');

    const runtimeErrors: string[] = [];
    const offlineFileHashResponses = new Map<string, boolean>();
    let offline = false;
    page.on('pageerror', error => runtimeErrors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error' && /chunk|worker|module script/i.test(message.text())) {
        runtimeErrors.push(message.text());
      }
    });
    page.on('response', (response) => {
      const pathname = new URL(response.url()).pathname;
      if (offline && /^\/assets\/file-hash(?:\.worker)?-[^/]+\.js$/.test(pathname)) {
        offlineFileHashResponses.set(pathname, response.fromServiceWorker());
      }
    });

    await page.goto('/');
    await waitForServiceWorkerController(page);
    expect((await getRuntimeCachePaths(page)).filter(path => path.includes('file-hash'))).toEqual([]);

    await page.goto('/file-hash');
    await expect(page).toHaveTitle('File hash - IT Tools');
    const input = page.getByTestId('file-hash-upload').locator('input[type="file"]');
    const abcFile = {
      name: 'abc.bin',
      mimeType: 'application/octet-stream',
      buffer: Buffer.from('abc'),
    };
    await input.setInputFiles(abcFile);
    await page.getByTestId('file-hash-run').click();
    await expect(page.getByTestId('file-hash-result-SHA-256')).toHaveText(ABC_SHA_256);

    await expect.poll(async () => (
      await getRuntimeCachePaths(page)
    ).filter(path => /^\/assets\/file-hash(?:\.worker)?-[^/]+\.js$/.test(path)).length).toBe(2);
    const fileHashAssetPaths = (await getRuntimeCachePaths(page))
      .filter(path => /^\/assets\/file-hash(?:\.worker)?-[^/]+\.js$/.test(path));
    expect(fileHashAssetPaths.some(path => path.includes('/file-hash.worker-'))).toBe(true);
    expect(fileHashAssetPaths.some(path => /\/file-hash-[^/]+\.js$/.test(path))).toBe(true);

    const cdpSession = await context.newCDPSession(page);
    await cdpSession.send('Network.enable');
    await cdpSession.send('Network.clearBrowserCache');
    await cdpSession.detach();

    offline = true;
    await context.setOffline(true);
    const navigationResponse = await page.reload({ waitUntil: 'domcontentloaded' });
    expect(navigationResponse?.fromServiceWorker()).toBe(true);
    await expect(page).toHaveTitle('File hash - IT Tools');
    await input.setInputFiles(abcFile);
    await page.getByTestId('file-hash-run').click();
    await expect(page.getByTestId('file-hash-result-SHA-256')).toHaveText(ABC_SHA_256);

    for (const assetPath of fileHashAssetPaths) {
      expect(offlineFileHashResponses.get(assetPath), `${assetPath} should be served by Workbox offline`).toBe(true);
    }
    expect(runtimeErrors).toEqual([]);
  });
});
