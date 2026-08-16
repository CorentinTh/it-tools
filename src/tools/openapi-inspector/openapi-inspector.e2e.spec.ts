import { expect, test } from '@playwright/test';

test.describe('Tool - OpenAPI Inspector', () => {
  test('inspects endpoints and generates local request and mock payload examples', async ({ page }) => {
    await page.goto('/openapi-inspector');
    await expect(page).toHaveTitle('OpenAPI Inspector - IT Tools');
    await page.getByTestId('openapi-inspect').click();
    await expect(page.getByTestId('openapi-status')).toContainText('Inspection finished locally');
    const output = page.getByTestId('openapi-output').locator('textarea');
    await expect(output).toHaveValue(/Operations: 2/);
    await expect(output).toHaveValue(/GET \/pets\/\{petId\}/);
    await expect(output).toHaveValue(/https:\/\/api\.example\.com\/pets\/pet-123/);
    await expect(output).toHaveValue(/Mock request payload/);
    await expect(output).toHaveValue(/"name": "Luna"/);
  });

  test('never fetches an external reference', async ({ page }) => {
    let externalRequests = 0;
    page.on('request', (request) => {
      if (request.url().startsWith('https://external.example/')) {
        externalRequests += 1;
      }
    });
    await page.goto('/openapi-inspector');
    await page.getByTestId('openapi-source').locator('textarea').fill(`openapi: 3.1.0
info: { title: Local only, version: '1' }
paths:
  /remote:
    $ref: https://external.example/path.yaml
`);
    await page.getByTestId('openapi-inspect').click();
    await expect(page.getByTestId('openapi-output').locator('textarea')).toHaveValue(/External reference/);
    expect(externalRequests).toBe(0);
  });
});
