import assert from 'node:assert/strict';

import { chromium } from '@playwright/test';

const developmentUrl = process.env.IT_TOOLS_DEV_URL ?? 'http://127.0.0.1:8091/';
const applicationCacheName = 'it-tools-lazy-assets-dev-smoke';
const unrelatedCacheName = 'dev-runtime-smoke-unrelated';
const browser = await chromium.launch();

try {
  const context = await browser.newContext({ serviceWorkers: 'allow' });
  const page = await context.newPage();
  const response = await page.goto(developmentUrl, { waitUntil: 'networkidle' });

  assert(response, `No document response received from ${developmentUrl}`);
  assert.equal(response.headers()['x-it-tools-mode'], 'development');

  await page.evaluate(async ({ applicationCacheName, unrelatedCacheName }) => {
    await caches.open(applicationCacheName);
    await caches.open(unrelatedCacheName);
  }, { applicationCacheName, unrelatedCacheName });
  await page.reload({ waitUntil: 'networkidle' });

  const state = await page.evaluate(async () => ({
    cacheNames: await caches.keys(),
    controller: navigator.serviceWorker.controller?.scriptURL ?? null,
    registrations: (await navigator.serviceWorker.getRegistrations()).map(registration => ({
      active: registration.active?.scriptURL ?? null,
      scope: registration.scope,
    })),
    scripts: [...document.scripts].map(script => script.src).filter(Boolean),
  }));

  assert(state.scripts.some(script => script.includes('/@vite/client')), 'Vite development client is missing');
  assert(state.scripts.some(script => script.includes('/src/main.ts')), 'Source entry /src/main.ts is missing');
  assert.equal(state.controller, null, `Development page is controlled by ${state.controller}`);
  assert(!state.registrations.some(registration => registration.active?.endsWith('/sw.js')), 'IT Tools Workbox registration remains active');
  assert(!state.cacheNames.includes(applicationCacheName), 'IT Tools development cache cleanup did not run');
  assert(state.cacheNames.includes(unrelatedCacheName), 'Development cleanup deleted an unrelated cache');

  await page.evaluate(cacheName => caches.delete(cacheName), unrelatedCacheName);
  process.stdout.write(`${JSON.stringify({ developmentUrl, state }, null, 2)}\n`);
}
finally {
  await browser.close();
}
