import { Buffer } from 'node:buffer';
import type { Route } from '@playwright/test';
import { expect, test } from '@playwright/test';

function makeAResponse(request: Buffer, address = [192, 0, 2, 25]): Buffer {
  const response = Buffer.alloc(request.length + 16);
  request.copy(response);
  response[2] = 0x81;
  response[3] = 0x80;
  response[6] = 0;
  response[7] = 1;
  response.set([0xC0, 0x0C, 0, 1, 0, 1, 0, 0, 0, 60, 0, 4, ...address], request.length);
  return response;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET',
  'Access-Control-Allow-Headers': 'content-type',
};

test.describe('DNS-over-HTTPS Query', () => {
  test('sends only an explicit bounded binary request, renders inert output, and aborts or rejects unsafe responses', async ({ page }) => {
    const marker = 'private-doh-marker-42.example';
    const dohRequests: Array<{ url: string; method: string; body: Buffer; headers: Record<string, string> }> = [];
    const markerTransportRequests: string[] = [];
    const markerUrlRequests: string[] = [];
    const markerConsoleMessages: string[] = [];
    let releaseSlow: (() => void) | undefined;

    page.on('request', (request) => {
      if (request.url().includes(marker)) {
        markerUrlRequests.push(request.url());
      }
    });
    page.on('console', (message) => {
      if (message.text().includes(marker)) {
        markerConsoleMessages.push(message.text());
      }
    });

    await page.route(/https:\/\/(?:cloudflare-dns|security\.cloudflare-dns)\.com\/dns-query/u, async (route: Route) => {
      const request = route.request();
      if (request.method() === 'OPTIONS') {
        await route.fulfill({ status: 200, headers: corsHeaders });
        return;
      }
      const body = request.postDataBuffer() ?? Buffer.alloc(0);
      dohRequests.push({ url: request.url(), method: request.method(), body, headers: request.headers() });
      const decoded = body.toString('latin1');
      if (decoded.includes('private-doh-marker-42')) {
        markerTransportRequests.push(request.url());
      }
      if (decoded.includes('slow')) {
        await new Promise<void>((resolve) => {
          releaseSlow = resolve;
        });
      }
      if (decoded.includes('bad-content')) {
        await route.fulfill({ status: 200, headers: { ...corsHeaders, 'Content-Type': 'text/html' }, body: '<a href="https://example.invalid/">unsafe</a>' }).catch(() => undefined);
        return;
      }
      await route.fulfill({
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/dns-message' },
        body: makeAResponse(body),
      }).catch(() => undefined);
    });

    await page.goto('/dns-over-https-query');
    await expect(page.getByRole('heading', { name: 'DNS-over-HTTPS Query' })).toBeVisible();
    expect(dohRequests).toEqual([]);

    await page.getByTestId('doh-name').fill(marker);
    expect(dohRequests).toEqual([]);
    await page.getByTestId('doh-query').click();
    await expect(page.getByTestId('doh-output')).toHaveValue(/private-doh-marker-42\.example\.[\s\S]*192\.0\.2\.25/u);
    expect(dohRequests).toHaveLength(1);
    expect(dohRequests[0]).toMatchObject({
      url: 'https://cloudflare-dns.com/dns-query',
      method: 'POST',
    });
    expect(dohRequests[0]!.url).not.toContain(marker);
    expect(dohRequests[0]!.headers['content-type']).toBe('application/dns-message');
    expect(dohRequests[0]!.body.toString('latin1')).toContain('private-doh-marker-42');
    expect(markerTransportRequests).toEqual(['https://cloudflare-dns.com/dns-query']);
    expect(markerUrlRequests).toEqual([]);
    expect(markerConsoleMessages).toEqual([]);
    expect(page.url()).not.toContain(marker);
    const stored = await page.evaluate(() => JSON.stringify({
      local: Object.entries(localStorage),
      session: Object.entries(sessionStorage),
    }));
    expect(stored).not.toContain(marker);
    await expect(page.getByTestId('doh-output').locator('a')).toHaveCount(0);

    await page.getByTestId('doh-name').fill('bad-content.example');
    await page.getByTestId('doh-query').click();
    await expect(page.getByTestId('doh-error')).toContainText('unexpected media type');
    await expect(page.getByTestId('doh-error')).not.toContainText('example.invalid');

    await page.getByTestId('doh-name').fill('slow.example');
    await page.getByTestId('doh-query').click();
    await expect(page.getByTestId('doh-cancel')).toBeVisible();
    await page.getByTestId('doh-cancel').click();
    await expect(page.getByTestId('doh-status')).toContainText('fetch was aborted');
    releaseSlow?.();
  });
});
