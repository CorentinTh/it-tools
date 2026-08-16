import { Buffer } from 'node:buffer';
import { readFileSync } from 'node:fs';

import { expect, test } from '@playwright/test';

function crc32(bytes: Uint8Array): number {
  let crc = 0xFFFF_FFFF;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xEDB8_8320 & -(crc & 1));
    }
  }
  return (crc ^ 0xFFFF_FFFF) >>> 0;
}

function pngWithPrivateText(): Buffer {
  const source = readFileSync(new URL('../../public/favicon-32x32.png', import.meta.url));
  const type = Buffer.from('tEXt');
  const data = Buffer.from('Comment\0private-location=51.5007,-0.1246');
  const chunk = Buffer.alloc(12 + data.length);
  chunk.writeUInt32BE(data.length, 0);
  type.copy(chunk, 4);
  data.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(chunk.subarray(4, 8 + data.length)), 8 + data.length);
  const afterHeader = 8 + 12 + 13;
  return Buffer.concat([source.subarray(0, afterHeader), chunk, source.subarray(afterHeader)]);
}

test.describe('Bounded local storage, metadata, and crypto wave', () => {
  test('calculates exact RAID capacity and conditional RAID 10 failure tolerance', async ({ page }) => {
    await page.goto('/raid-storage-calculator');
    await expect(page.locator('.tool-header h1')).toHaveText('RAID & Storage Capacity Calculator');
    await expect(page.getByTestId('raid-result')).toContainText('10.913936… TiB');

    await page.getByLabel('RAID level').click();
    await page.getByText('RAID 10 — mirrored stripes', { exact: true }).click();
    await page.getByTestId('raid-disk-count').locator('input').fill('8');
    await page.getByLabel('Result display unit').click();
    await page.getByRole('option', { name: 'TB (10¹² bytes, drive label)', exact: true }).click();
    await page.getByTestId('raid-calculate').click();
    await expect(page.getByTestId('raid-result')).toContainText('16 TB');
    await expect(page.getByTestId('raid-result')).toContainText('up to 4');
  });

  test('removes a real PNG text chunk locally without leaking its file name or metadata', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', request => requests.push(request.url()));
    await page.goto('/image-metadata-remover');
    const before = requests.length;
    await page.locator('input[type="file"]').setInputFiles({
      name: 'private-location.png',
      mimeType: 'image/png',
      buffer: pngWithPrivateText(),
    });
    await page.getByTestId('metadata-remove').click();
    await expect(page.getByTestId('metadata-result')).toContainText('PNG tEXt × 1');
    await expect(page.getByTestId('metadata-result').locator('img')).toHaveAttribute('src', /^blob:/u);
    expect(requests.slice(before).some(url => url.includes('private-location') || url.includes('51.5007'))).toBe(false);
  });

  test('round-trips an authenticated text envelope in the disposable worker', async ({ page }) => {
    await page.goto('/aes-gcm-envelope');
    await page.getByTestId('aes-passphrase').locator('input').fill('correct horse battery staple');
    await page.getByTestId('aes-passphrase-confirm').locator('input').fill('correct horse battery staple');
    await page.getByTestId('aes-text-input').locator('textarea').fill('private Unicode payload 😀');
    await page.getByTestId('aes-run').click();
    const encryptedOutput = page.locator('[data-test-id="aes-text-output"] textarea');
    await expect(encryptedOutput).toHaveValue(/^SVRBRQ/u);
    const envelope = await encryptedOutput.inputValue();

    await page.getByLabel('Operation').click();
    await page.getByText('Decrypt Base64 envelope → text', { exact: true }).click();
    await page.getByTestId('aes-base64-input').locator('textarea').fill(envelope);
    await page.getByTestId('aes-run').click();
    await expect(page.locator('[data-test-id="aes-text-output"] textarea')).toHaveValue('private Unicode payload 😀');
  });
});
