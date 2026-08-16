import { Buffer } from 'node:buffer';
import { readFile } from 'node:fs/promises';

import { type Page, expect, test } from '@playwright/test';

const SNAPPY_FIXTURE = 'UEFSMRUEFRAVFBWxmLPVCDwVAhUAAAAIHAAAAAAAAAAAFQYVBhUKXBXQDxUAFdAPFRAVABUAAAADCADQDxUEFVAVVBWjo4S4CTwVAhUAAAAonCQAAABjOTVlMjYzYS1mNWQ0LTQwMWYtODEwNy01Y2E3MTQ2YTFmOTgVBhUGFQpcFdAPFQAV0A8VEBUAFQAAAAMIANAPGRECGRgIAAAAAAAAAAAZGAgAAAAAAAAAABUCGRYAABkRAhkYJGM5NWUyNjNhLWY1ZDQtNDAxZi04MTA3LTVjYTcxNDZhMWY5OBkYJGM5NWUyNjNhLWY1ZDQtNDAxZi04MTA3LTVjYTcxNDZhMWY5OBUCGRYAABkcFkIVOBYAAAAZHBb0ARU4FgAAABUCGTxIAW0VBAAVBCUAGApsb25nX2ZpZWxkABUMJQAYDGJpbmFyeV9maWVsZAAW0A8ZHBksJkIcFQQZJRAAGRgKbG9uZ19maWVsZBUCFtAPFmoWciZCJggcGAgAAAAAAAAAABgIAAAAAAAAAAAWACgIAAAAAAAAAAAYCAAAAAAAAAAAABksFQQVABUCABUGFRAVAgAAFpgEFRQWrAIVPgAm9AEcFQwZJRAAGRgMYmluYXJ5X2ZpZWxkFQIW0A8WqgEWsgEm9AEmehwYJGM5NWUyNjNhLWY1ZDQtNDAxZi04MTA3LTVjYTcxNDZhMWY5OBgkYzk1ZTI2M2EtZjVkNC00MDFmLTgxMDctNWNhNzE0NmExZjk4FgAoJGM5NWUyNjNhLWY1ZDQtNDAxZi04MTA3LTVjYTcxNDZhMWY5OBgkYzk1ZTI2M2EtZjVkNC00MDFmLTgxMDctNWNhNzE0NmExZjk4ABksFQQVABUCABUGFRAVAgAAFqwEFRYW6gIVrgEAFpQCFtAPJggWpAIUAAAZHBgRd3JpdGVyLm1vZGVsLm5hbWUYB2V4YW1wbGUAGFNwYXJxdWV0LW1yIHZlcnNpb24gMS4xMy4wLVNOQVBTSE9UIChidWlsZCAyNjFmN2QyNjc5NDA3YzgzMzU0NWI1NmY0Yzg1YTRhZThiNWM5ZWQ0KRksHAAAHAAAAA0CAABQQVIx';

function uploadFixture(page: Page, name: string) {
  return page.getByTestId('parquet-upload').locator('input[type="file"]').setInputFiles({
    name,
    mimeType: 'application/vnd.apache.parquet',
    buffer: Buffer.from(SNAPPY_FIXTURE, 'base64'),
  });
}

test.describe('Parquet Reader', () => {
  test('inspects and previews an official Apache fixture with vertical desktop layout and bounded exports', async ({ context, page }) => {
    const marker = 'private-parquet-marker-42';
    const observedRequests: Array<{ body: string | null; url: string }> = [];
    const markerConsoleMessages: string[] = [];
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    page.on('request', request => observedRequests.push({ body: request.postData(), url: request.url() }));
    page.on('console', (message) => {
      if (message.text().includes(marker)) {
        markerConsoleMessages.push(message.text());
      }
    });

    await page.goto('/parquet-reader');
    await expect(page.locator('.tool-header h1')).toHaveText('Parquet Reader');
    await uploadFixture(page, `${marker}.parquet`);
    await expect(page.getByTestId('parquet-selection')).toContainText(marker);
    await expect(page.getByTestId('parquet-metadata')).toHaveCount(0);

    await page.getByTestId('parquet-inspect').click();
    await expect(page.getByTestId('parquet-status')).toContainText('Metadata inspected', { timeout: 20_000 });
    await expect(page.getByTestId('parquet-metadata')).toContainText('Rows: 1,000');
    await expect(page.getByTestId('parquet-metadata')).toContainText('SNAPPY');
    await expect(page.getByTestId('parquet-schema')).toContainText('binary_field');

    await page.getByTestId('parquet-preview').click();
    await expect(page.getByTestId('parquet-status')).toContainText('decoded', { timeout: 20_000 });
    await expect(page.getByTestId('parquet-table')).toContainText('binary_field');
    await expect(page.getByTestId('parquet-table').locator('tbody tr')).toHaveCount(50);

    const metadataBox = await page.getByTestId('parquet-metadata').boundingBox();
    const previewBox = await page.getByTestId('parquet-preview-result').boundingBox();
    expect(metadataBox).not.toBeNull();
    expect(previewBox).not.toBeNull();
    expect(metadataBox!.width).toBeGreaterThan(600);
    expect(previewBox!.width).toBeGreaterThan(600);
    expect(previewBox!.y).toBeGreaterThan(metadataBox!.y + metadataBox!.height);

    await page.getByTestId('parquet-copy-json').click();
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(JSON.parse(clipboard)).toHaveLength(50);
    expect(clipboard).not.toContain(marker);

    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('parquet-download-csv').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('parquet-preview.csv');
    const downloadPath = await download.path();
    expect(downloadPath).not.toBeNull();
    const csv = await readFile(downloadPath!, 'utf8');
    expect(csv).toContain('long_field,binary_field');
    expect(csv).not.toContain(marker);

    expect(page.url()).not.toContain(marker);
    const stored = await page.evaluate(() => JSON.stringify({ local: Object.entries(localStorage), session: Object.entries(sessionStorage) }));
    expect(stored).not.toContain(marker);
    expect(observedRequests.every(request => !request.url.includes(marker) && !request.body?.includes(marker))).toBe(true);
    expect(markerConsoleMessages).toEqual([]);

    await page.reload();
    await expect(page.getByTestId('parquet-selection')).toHaveCount(0);
  });

  test('decodes Snappy and terminates a cancelled disposable worker cleanly', async ({ page }) => {
    await page.addInitScript(() => {
      const nativePostMessage = Worker.prototype.postMessage;
      Object.defineProperty(Worker.prototype, 'postMessage', {
        configurable: true,
        value(this: Worker, message: unknown, options?: StructuredSerializeOptions | Transferable[]) {
          window.setTimeout(() => {
            try {
              Reflect.apply(nativePostMessage, this, options === undefined ? [message] : [message, options]);
            }
            catch {
              // A cancelled task terminates its worker before this delayed send.
            }
          }, 250);
        },
      });
    });
    await page.goto('/parquet-reader');
    await uploadFixture(page, 'snappy.parquet');

    await page.getByTestId('parquet-inspect').click();
    await page.getByTestId('parquet-cancel').click();
    await expect(page.getByTestId('parquet-status')).toContainText('cancelled');
    await page.getByTestId('parquet-inspect').click();
    await expect(page.getByTestId('parquet-status')).toContainText('Metadata inspected', { timeout: 20_000 });
    await expect(page.getByTestId('parquet-metadata')).toContainText('SNAPPY');
    await page.getByTestId('parquet-preview').click();
    await expect(page.getByTestId('parquet-status')).toContainText('decoded', { timeout: 20_000 });
    await expect(page.getByTestId('parquet-table').locator('tbody tr')).toHaveCount(50);

    await page.getByTestId('parquet-clear').click();
    await expect(page.getByTestId('parquet-selection')).toHaveCount(0);
    await expect(page.getByTestId('parquet-preview-result')).toHaveCount(0);
  });
});
