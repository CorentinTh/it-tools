import { expect, test } from '@playwright/test';

test.describe('Tool - ASCII text drawer', () => {
  test('loads its font from the application origin', async ({ page, baseURL }) => {
    const externalRequests: string[] = [];
    const applicationOrigin = new URL(baseURL ?? 'http://localhost:5050').origin;

    page.on('request', (request) => {
      const requestUrl = new URL(request.url());
      if (requestUrl.protocol.startsWith('http') && requestUrl.origin !== applicationOrigin) {
        externalRequests.push(request.url());
      }
    });

    await page.goto('/ascii-text-drawer');

    await expect(page.getByText('Loading font...')).toBeHidden();
    await expect(page.getByText('ASCII art text', { exact: true })).toBeVisible();
    await expect(page.getByRole('spinbutton', { name: 'Output width (0–10,000)' })).toBeVisible();
    expect(externalRequests).toEqual([]);
  });
});
