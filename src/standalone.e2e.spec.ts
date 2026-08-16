import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

import { expect, test } from '@playwright/test';

const standaloneEnabled = process.env.STANDALONE_TEST === 'true';
const outputDirectory = resolve('dist-standalone');
const outputPath = resolve(outputDirectory, 'it-tools.html');
const dataLensCsp = 'default-src \'none\'; script-src https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://cdn.tailwindcss.com https://yastatic.net \'unsafe-inline\' \'unsafe-eval\'; style-src https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://cdn.tailwindcss.com https://yastatic.net https://fonts.googleapis.com \'unsafe-inline\'; img-src https://yastatic.net data: blob:; font-src https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.gstatic.com data:; media-src data: blob:; connect-src \'none\'; form-action \'none\'; frame-src \'none\'; object-src \'none\'; worker-src \'none\'; base-uri \'none\'';

function injectDataLensCsp(html: string) {
  return `<!DOCTYPE html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${dataLensCsp}">${html}`;
}

test.describe('standalone single-file build', () => {
  test.skip(!standaloneEnabled, 'Run through pnpm test:standalone.');

  test('contains one self-sufficient HTML file and runs local routes, workers, and datasets', async ({ page }) => {
    test.setTimeout(120_000);
    expect(readdirSync(outputDirectory)).toEqual(['it-tools.html']);
    expect(statSync(outputPath).size).toBeLessThanOrEqual(10 * 1024 * 1024);

    const html = readFileSync(outputPath, 'utf8');
    expect(html).not.toMatch(/<script\b[^>]*\bsrc=/i);
    expect(html).not.toMatch(/<link\b[^>]*rel=["'](?:stylesheet|modulepreload|manifest)["'][^>]*href=(?!["']data:)/i);

    const runtimeErrors: string[] = [];
    page.on('pageerror', error => runtimeErrors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') {
        runtimeErrors.push(message.text());
      }
    });

    const fileUrl = pathToFileURL(outputPath).href;
    await page.goto(`${fileUrl}#/`);
    await expect(page.locator('a[href] .tool-card').first()).toBeVisible();
    await expect.poll(() => page.locator('a[href] .tool-card').count()).toBe(126);

    await page.goto(`${fileUrl}#/text-statistics`);
    await expect(page.locator('.tool-header h1')).toContainText('Text statistics');
    await page.getByLabel('Text to analyze').fill('one two three');
    await page.getByTestId('text-statistics-run').click();
    await expect(page.getByTestId('text-statistics-status')).toContainText('Text analyzed');
    await expect(page.locator('.statistics-grid')).toContainText('3');

    await page.goto(`${fileUrl}#/ascii-text-drawer`);
    await expect(page.locator('.tool-header h1')).toContainText('ASCII');
    await expect(page.locator('textarea').last()).not.toHaveValue('', { timeout: 20_000 });

    const externalResources = await page.evaluate(() => performance.getEntriesByType('resource')
      .map(entry => entry.name)
      .filter(url => /^https?:/i.test(url)));
    expect(externalResources).toEqual([]);
    expect(runtimeErrors).toEqual([]);
  });

  test('runs inside the DataLens opaque-origin CSP sandbox and uses the host protocol', async ({ page }) => {
    test.setTimeout(180_000);
    const runtimeErrors: string[] = [];
    page.on('pageerror', error => runtimeErrors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') {
        runtimeErrors.push(message.text());
      }
    });

    await page.route('https://datalens.test/**', route => route.fulfill({
      body: injectDataLensCsp(readFileSync(outputPath, 'utf8')),
      contentType: 'text/html; charset=utf-8',
      headers: { 'Cache-Control': 'no-store' },
    }));
    await page.route('https://host.test/', route => route.fulfill({
      body: `
        <iframe src="https://datalens.test/page?theme=dark&lang=ru"
                sandbox="allow-scripts" allow="" referrerpolicy="no-referrer"></iframe>
        <script>
          window.hostMessages = [];
          window.addEventListener('message', event => window.hostMessages.push(event.data));
        </script>
      `,
      contentType: 'text/html; charset=utf-8',
      headers: { 'Cross-Origin-Opener-Policy': 'same-origin' },
    }));
    await page.goto('https://host.test/');

    const frame = page.frameLocator('iframe');
    await expect(frame.locator('a[href] .tool-card').first()).toBeVisible({ timeout: 60_000 });
    await expect.poll(() => frame.locator('a[href] .tool-card').count()).toBe(126);
    await expect.poll(() => frame.locator('.standalone-menu-item').count()).toBe(126);
    await expect(frame.locator('.standalone-menu-item').first()).not.toHaveText('');
    await expect(frame.locator('.standalone-menu-item svg').first()).toBeAttached();
    expect(await frame.locator('html').evaluate(() => {
      try {
        void window.localStorage;
        return false;
      }
      catch (error) {
        return error instanceof DOMException && error.name === 'SecurityError';
      }
    })).toBe(true);

    await frame.locator('html').evaluate(() => {
      location.hash = '#/json-to-csv';
    });
    await expect(frame.locator('.tool-header h1')).toContainText('JSON to CSV');
    await frame.getByLabel('Your raw JSON').fill('[{"name":"Ada"}]');
    await frame.getByTestId('json-to-csv-run').click();
    await expect(frame.getByTestId('json-to-csv-status')).toContainText(/completed/i);
    await frame.getByTestId('json-to-csv-download').click();
    await expect.poll(() => page.evaluate(() => (window as unknown as { hostMessages: unknown[] }).hostMessages.length)).toBeGreaterThan(0);
    const exportMessage = await page.evaluate(() => (window as unknown as {
      hostMessages: Array<{ code: string; data: { mime: string; name: string } }>
    }).hostMessages.find(message => message.code === 'EXPORT'));
    expect(exportMessage).toMatchObject({
      code: 'EXPORT',
      data: { mime: 'text/plain;charset=utf-8', name: 'converted.csv' },
    });

    await frame.locator('body').evaluate((body) => {
      const anchor = document.createElement('a');
      anchor.href = 'https://example.com/standalone-test';
      anchor.textContent = 'External test';
      body.appendChild(anchor);
      anchor.click();
    });
    await expect.poll(() => page.evaluate(() => (window as unknown as {
      hostMessages: Array<{ code: string }>
    }).hostMessages.some(message => message.code === 'OPEN_URL'))).toBe(true);

    const externalResources = await frame.locator('html').evaluate(() => performance.getEntriesByType('resource')
      .map(entry => entry.name)
      .filter(url => /^https?:/i.test(url)));
    expect(externalResources).toEqual([]);
    expect(runtimeErrors).toEqual([]);
  });
});
