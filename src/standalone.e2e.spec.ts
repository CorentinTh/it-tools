import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

import { expect, test } from '@playwright/test';

const standaloneEnabled = process.env.STANDALONE_TEST === 'true';
const outputDirectory = resolve('dist-standalone');
const outputPath = resolve(outputDirectory, 'it-tools.html');

test.describe('standalone single-file build', () => {
  test.skip(!standaloneEnabled, 'Run through pnpm test:standalone.');

  test('contains one self-sufficient HTML file and runs local routes, workers, and datasets', async ({ page }) => {
    test.setTimeout(120_000);
    expect(readdirSync(outputDirectory)).toEqual(['it-tools.html']);
    expect(statSync(outputPath).size).toBeLessThanOrEqual(10 * 1024 * 1024);

    const html = readFileSync(outputPath, 'utf8');
    expect(html).toContain('__IT_TOOLS_STANDALONE_FONTS__');
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
    await expect.poll(() => page.locator('a[href] .tool-card').count()).toBe(130);

    await page.goto(`${fileUrl}#/text-statistics`);
    await expect(page.locator('.tool-header h1')).toContainText('Text statistics');
    await page.getByLabel('Text to analyze').fill('one two three');
    await page.getByTestId('text-statistics-run').click();
    await expect(page.getByTestId('text-statistics-status')).toContainText('Text analyzed');
    await expect(page.locator('.statistics-grid')).toContainText('3');

    await page.goto(`${fileUrl}#/offline-geoip-inspector`);
    await page.getByTestId('geoip-address').fill('1.1.1.1');
    await page.getByTestId('geoip-inspect').click();
    await expect(page.getByTestId('geoip-result')).toContainText('Australia (AU)', { timeout: 20_000 });

    await page.goto(`${fileUrl}#/ascii-text-drawer`);
    await expect(page.locator('.tool-header h1')).toContainText('ASCII');
    await expect(page.locator('textarea').last()).not.toHaveValue('', { timeout: 20_000 });

    const externalResources = await page.evaluate(() => performance.getEntriesByType('resource')
      .map(entry => entry.name)
      .filter(url => /^https?:/i.test(url)));
    expect(externalResources).toEqual([]);
    expect(runtimeErrors).toEqual([]);
  });
});
