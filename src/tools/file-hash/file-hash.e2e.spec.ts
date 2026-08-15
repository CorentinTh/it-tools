import { Buffer } from 'node:buffer';
import { expect, test } from '@playwright/test';

const ABC_DIGESTS = {
  'SHA-256': 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
  'SHA-384': 'cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7',
  'SHA-512': 'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f',
  'SHA3-256': '3a985da74fe225b2045c172d6bd390bd855f086e3e9d525b46bfe24511431532',
  'BLAKE3-256': '6437b3ac38465133ffb63b75273a8db548c558465d79db03fd359c6cd5bd9d85',
  'SHA-1': 'a9993e364706816aba3e25717850c26c9cd0d89d',
  'MD5': '900150983cd24fb0d6963f7d28e17f72',
} as const;

test.use({ serviceWorkers: 'block' });

test.describe('Tool - File hash', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/file-hash');
  });

  test('hashes a local binary file only after an explicit action', async ({ context, page }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await expect(page).toHaveTitle('File hash - IT Tools');
    await expect(page.getByTestId('file-hash-status')).toContainText('Nothing is processed on selection');
    await expect(page.getByTestId('file-hash-run')).toBeDisabled();

    await page.getByTestId('file-hash-upload').locator('input[type="file"]').setInputFiles({
      name: 'abc.bin',
      mimeType: 'application/octet-stream',
      buffer: Buffer.from([0x61, 0x62, 0x63]),
    });

    await expect(page.getByTestId('file-hash-name')).toHaveText('abc.bin');
    await expect(page.getByTestId('file-hash-status')).toContainText('File selected');
    await expect(page.getByTestId('file-hash-results')).toHaveCount(0);

    await page.getByTestId('file-hash-algorithm-SHA-384').click();
    await page.getByTestId('file-hash-algorithm-SHA-512').click();
    await page.getByTestId('file-hash-algorithm-SHA3-256').click();
    await page.getByTestId('file-hash-algorithm-BLAKE3-256').click();
    await page.getByTestId('file-hash-algorithm-SHA-1').click();
    await page.getByTestId('file-hash-algorithm-MD5').click();
    await page.getByTestId('file-hash-run').click();

    await expect(page.getByTestId('file-hash-status')).toContainText('Hashing completed', { timeout: 15_000 });
    await expect(page.getByTestId('file-hash-result-SHA-256')).toHaveText(ABC_DIGESTS['SHA-256']);
    await expect(page.getByTestId('file-hash-result-SHA-384')).toHaveText(ABC_DIGESTS['SHA-384']);
    await expect(page.getByTestId('file-hash-result-SHA-512')).toHaveText(ABC_DIGESTS['SHA-512']);
    await expect(page.getByTestId('file-hash-result-SHA3-256')).toHaveText(ABC_DIGESTS['SHA3-256']);
    await expect(page.getByTestId('file-hash-result-BLAKE3-256')).toHaveText(ABC_DIGESTS['BLAKE3-256']);
    await expect(page.getByTestId('file-hash-result-SHA-1')).toHaveText(ABC_DIGESTS['SHA-1']);
    await expect(page.getByTestId('file-hash-result-MD5')).toHaveText(ABC_DIGESTS.MD5);

    await page.getByTestId('file-hash-copy-SHA-256').click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe(ABC_DIGESTS['SHA-256']);
  });

  test('keeps file names and contents out of network, URL, and browser storage', async ({ page }) => {
    const fileNameMarker = `private-name-${Date.now()}.txt`;
    const contentMarker = `private-content-${Date.now()}-never-transmit`;
    const observedRequests: Array<{ url: string; body: string | null }> = [];
    page.on('request', request => observedRequests.push({ url: request.url(), body: request.postData() }));

    await page.getByTestId('file-hash-upload').locator('input[type="file"]').setInputFiles({
      name: fileNameMarker,
      mimeType: 'text/plain',
      buffer: Buffer.from(contentMarker),
    });
    await page.getByTestId('file-hash-run').click();
    await expect(page.getByTestId('file-hash-status')).toContainText('Hashing completed', { timeout: 15_000 });

    const browserState = await page.evaluate(() => ({
      local: Object.values(localStorage),
      session: Object.values(sessionStorage),
      url: window.location.href,
    }));
    const requests = JSON.stringify(observedRequests);
    for (const marker of [fileNameMarker, contentMarker]) {
      expect(browserState.local.every(value => !value.includes(marker))).toBe(true);
      expect(browserState.session.every(value => !value.includes(marker))).toBe(true);
      expect(browserState.url).not.toContain(marker);
      expect(requests).not.toContain(marker);
    }

    await page.reload();
    await expect(page.getByTestId('file-hash-selection')).toHaveCount(0);
    await expect(page.getByTestId('file-hash-results')).toHaveCount(0);
    await expect(page.getByTestId('file-hash-status')).toContainText('Nothing is processed on selection');
  });

  test('supports an empty file and same-file reselection after Clear', async ({ page }) => {
    const input = page.getByTestId('file-hash-upload').locator('input[type="file"]');
    const emptyFile = {
      name: 'empty.bin',
      mimeType: 'application/octet-stream',
      buffer: Buffer.alloc(0),
    };

    await input.setInputFiles(emptyFile);
    await page.getByTestId('file-hash-run').click();
    await expect(page.getByTestId('file-hash-result-SHA-256')).toHaveText(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    );

    await page.getByTestId('file-hash-clear').click();
    await expect(page.getByTestId('file-hash-selection')).toHaveCount(0);
    await input.setInputFiles(emptyFile);
    await expect(page.getByTestId('file-hash-name')).toHaveText('empty.bin');
    await expect(page.getByTestId('file-hash-run')).toBeEnabled();
  });
});
