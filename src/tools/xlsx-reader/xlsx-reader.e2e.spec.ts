import { Buffer } from 'node:buffer';
import { readFile } from 'node:fs/promises';

import { type Page, expect, test } from '@playwright/test';

const XLSX_FIXTURE = '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';

function uploadFixture(page: Page, name: string) {
  return page.getByTestId('xlsx-upload').locator('input[type="file"]').setInputFiles({
    name,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: Buffer.from(XLSX_FIXTURE, 'base64'),
  });
}

test.describe('XLSX Spreadsheet Reader', () => {
  test('inspects and previews a bounded local page with exact values and vertical layout', async ({ context, page }) => {
    const marker = 'private-xlsx-marker-42';
    const observedRequests: Array<{ body: string | null; url: string }> = [];
    const markerConsoleMessages: string[] = [];
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    page.on('request', request => observedRequests.push({ body: request.postData(), url: request.url() }));
    page.on('console', (message) => {
      if (message.text().includes(marker)) {
        markerConsoleMessages.push(message.text());
      }
    });

    await page.goto('/xlsx-reader');
    await expect(page.locator('.tool-header h1')).toHaveText('XLSX Spreadsheet Reader');
    await uploadFixture(page, `${marker}.xlsx`);
    await expect(page.getByTestId('xlsx-selection')).toContainText(marker);
    await expect(page.getByTestId('xlsx-metadata')).toHaveCount(0);

    await page.getByTestId('xlsx-inspect').click();
    await expect(page.getByTestId('xlsx-status')).toContainText('Workbook inspected', { timeout: 20_000 });
    await expect(page.getByTestId('xlsx-metadata')).toContainText('1904');
    await expect(page.getByTestId('xlsx-metadata')).toContainText('External-link declarations: 1');
    await expect(page.getByTestId('xlsx-sheets-table')).toContainText('Data & IDs');

    await page.getByTestId('xlsx-preview').click();
    await expect(page.getByTestId('xlsx-status')).toContainText('decoded', { timeout: 20_000 });
    await expect(page.getByTestId('xlsx-table')).toContainText('900719925474099312345');
    await expect(page.getByTestId('xlsx-formula-note')).toContainText('2 formula cell');
    await expect(page.getByTestId('xlsx-table').locator('tbody tr')).toHaveCount(50);

    const metadataBox = await page.getByTestId('xlsx-metadata').boundingBox();
    const previewBox = await page.getByTestId('xlsx-preview-result').boundingBox();
    expect(metadataBox).not.toBeNull();
    expect(previewBox).not.toBeNull();
    expect(metadataBox!.width).toBeGreaterThan(600);
    expect(previewBox!.width).toBeGreaterThan(600);
    expect(previewBox!.y).toBeGreaterThan(metadataBox!.y + metadataBox!.height);

    await page.getByTestId('xlsx-copy-json').click();
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(JSON.parse(clipboard)).toHaveLength(50);
    expect(clipboard).toContain('900719925474099312345');
    expect(clipboard).not.toContain(marker);

    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('xlsx-download-csv').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('xlsx-page.csv');
    const downloadPath = await download.path();
    expect(downloadPath).not.toBeNull();
    const csv = await readFile(downloadPath!, 'utf8');
    expect(csv).toContain('\'=2+2');
    expect(csv).not.toContain(marker);

    expect(page.url()).not.toContain(marker);
    const stored = await page.evaluate(() => JSON.stringify({ local: Object.entries(localStorage), session: Object.entries(sessionStorage) }));
    expect(stored).not.toContain(marker);
    expect(observedRequests.every(request => !request.url.includes(marker) && !request.body?.includes(marker))).toBe(true);
    expect(markerConsoleMessages).toEqual([]);

    await page.reload();
    await expect(page.getByTestId('xlsx-selection')).toHaveCount(0);
  });

  test('terminates a cancelled disposable worker and can start a clean replacement', async ({ page }) => {
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
    await page.goto('/xlsx-reader');
    await uploadFixture(page, 'bounded.xlsx');

    await page.getByTestId('xlsx-inspect').click();
    await page.getByTestId('xlsx-cancel').click();
    await expect(page.getByTestId('xlsx-status')).toContainText('cancelled');
    await page.getByTestId('xlsx-inspect').click();
    await expect(page.getByTestId('xlsx-status')).toContainText('Workbook inspected', { timeout: 20_000 });
    await page.getByTestId('xlsx-preview').click();
    await expect(page.getByTestId('xlsx-status')).toContainText('decoded', { timeout: 20_000 });

    await page.getByTestId('xlsx-clear').click();
    await expect(page.getByTestId('xlsx-selection')).toHaveCount(0);
    await expect(page.getByTestId('xlsx-preview-result')).toHaveCount(0);
  });
});
