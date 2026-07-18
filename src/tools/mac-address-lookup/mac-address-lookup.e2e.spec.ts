import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

const workerPathPattern = /\/assets\/mac-address-lookup\.worker-[a-f\d]{8}\.js$/i;

test.describe('Tool - MAC address lookup private local database', () => {
  test('uses one prefix-independent worker request and disposes it with the route', async ({ context, page }) => {
    const requests: Array<{ path: string; postData: string | null }> = [];
    page.on('request', (request) => {
      requests.push({
        path: new URL(request.url()).pathname,
        postData: request.postData(),
      });
    });

    await page.goto('/mac-address-lookup');
    await expect(page.getByText('Cisco Systems, Inc')).toBeVisible();
    await expect.poll(() => page.workers().length).toBe(1);

    const workerRequests = requests.filter(request => workerPathPattern.test(request.path));
    expect(workerRequests).toHaveLength(1);
    const requestCountAfterWorkerReady = requests.length;

    await page.getByPlaceholder('Type a MAC address').fill('F8:E4:3B:12:34:56');
    await expect(page.getByText('ASIX Electronics Corporation')).toBeVisible();
    await page.getByPlaceholder('Type a MAC address').fill('02:00:00:12:34:56');
    await expect(page.getByText('Unknown vendor for this address')).toBeVisible();
    expect(requests).toHaveLength(requestCountAfterWorkerReady);

    await context.setOffline(true);
    await page.getByPlaceholder('Type a MAC address').fill('20:37:06:FF:EE:DD');
    await expect(page.getByText('Cisco Systems, Inc')).toBeVisible();
    expect(requests).toHaveLength(requestCountAfterWorkerReady);
    await context.setOffline(false);

    for (const request of requests) {
      const networkPayload = `${decodeURIComponent(request.path)} ${request.postData ?? ''}`.toUpperCase();
      expect(networkPayload).not.toContain('203706');
      expect(networkPayload).not.toContain('F8E43B');
      expect(networkPayload).not.toContain('020000');
      expect(request.path).not.toMatch(/\/assets\/(?:20|F8|02)-[a-f\d]{8}\.js$/i);
    }

    await page.locator('a[href="/"]').first().click();
    await expect(page).toHaveURL('/');
    await expect.poll(() => page.workers().length).toBe(0);
  });

  test('retries the exact same fixed worker URL after a load failure', async ({ page }) => {
    const workerAttempts: string[] = [];
    let abortFirstWorker = true;
    await page.route(workerPathPattern, async (route) => {
      const path = new URL(route.request().url()).pathname;
      workerAttempts.push(path);
      if (abortFirstWorker) {
        abortFirstWorker = false;
        await route.abort('failed');
        return;
      }
      await route.continue();
    });

    await page.goto('/mac-address-lookup');
    await expect(page.getByRole('alert')).toContainText('could not be loaded');
    await page.getByTestId('retry-vendor-lookup').click();
    await expect(page.getByText('Cisco Systems, Inc')).toBeVisible();

    expect(workerAttempts).toHaveLength(2);
    expect(workerAttempts[1]).toBe(workerAttempts[0]);
  });
});
