import { expect, test } from '@playwright/test';

test.describe('Tool - Offline GeoIP Inspector', () => {
  test('loads the bundled IPv4 and IPv6 datasets without an API request', async ({ page }) => {
    const externalRequests: string[] = [];
    page.on('request', (request) => {
      if (!['127.0.0.1', 'localhost'].includes(new URL(request.url()).hostname)) {
        externalRequests.push(request.url());
      }
    });
    await page.goto('/offline-geoip-inspector');
    await expect(page).toHaveTitle('Offline GeoIP inspector - IT Tools');

    await page.getByTestId('geoip-inspect').click();
    await expect(page.getByTestId('geoip-result')).toContainText('Australia (AU)', { timeout: 20_000 });

    await page.getByTestId('geoip-address').fill('2606:4700:4700::1111');
    await page.getByTestId('geoip-inspect').click();
    await expect(page.getByTestId('geoip-result')).toContainText('United States (US)', { timeout: 20_000 });
    expect(externalRequests).toEqual([]);
  });
});
