import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

test.describe('Tool - JSON Schema validator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-schema-validator');
  });

  test('validates only on request and renders structured validation errors', async ({ page }) => {
    await expect(page).toHaveTitle('JSON Schema validator - IT Tools');
    await expect(page.getByTestId('json-schema-source')).toHaveValue(/additionalProperties/);
    await expect(page.getByTestId('json-schema-instance')).toHaveValue(/Ada Lovelace/);
    const draftSelect = page.getByTestId('json-schema-draft');
    const draftInput = draftSelect.locator('.c-select-input');
    await expect(draftInput).toContainText('Draft 2020-12');
    await expect(page.getByTestId('json-schema-status')).toContainText('only when you select Validate');
    await expect(page.getByTestId('json-schema-errors')).toHaveCount(0);

    await draftInput.click();
    await draftSelect.getByText('Draft 7', { exact: true }).click();
    await expect(draftInput).toContainText('Draft 7');

    await page.getByTestId('json-schema-source').fill(`{
      "type": "object",
      "properties": {
        "count": { "type": "integer", "minimum": 1 }
      },
      "required": ["count"],
      "additionalProperties": false
    }`);
    await page.getByTestId('json-schema-instance').fill(`{
      "count": 0,
      "unexpected": true
    }`);

    await expect(page.getByTestId('json-schema-status')).toContainText('Select Validate');
    await expect(page.getByTestId('json-schema-errors')).toHaveCount(0);

    await page.getByTestId('json-schema-validate').click();

    await expect(page.getByTestId('json-schema-status')).toContainText('2 validation errors found', { timeout: 15_000 });
    const errors = page.getByTestId('json-schema-errors');
    await expect(errors).toBeVisible();
    await expect(errors.locator('li')).toHaveCount(2);
    await expect(errors).toContainText('must NOT have additional properties');
    await expect(errors).toContainText('/count — must be >= 1');
    await expect(errors).toContainText('Line 2, column 16');
    await expect(errors).toContainText('Schema path:');
  });

  test('keeps schema and instance data session-only and local to the browser', async ({ page }) => {
    const schemaMarker = `schema-private-${Date.now()}-do-not-persist`;
    const instanceMarker = `instance-private-${Date.now()}-do-not-transmit`;
    const observedRequests: Array<{ url: string; body: string | null }> = [];
    page.on('request', (request) => {
      observedRequests.push({ url: request.url(), body: request.postData() });
    });

    await page.getByTestId('json-schema-source').fill(`{
      "$comment": "${schemaMarker}",
      "type": "string"
    }`);
    await page.getByTestId('json-schema-instance').fill(JSON.stringify(instanceMarker));
    await page.getByTestId('json-schema-validate').click();
    await expect(page.getByTestId('json-schema-status')).toContainText('is valid', { timeout: 15_000 });

    const browserState = await page.evaluate(() => ({
      local: Object.values(localStorage),
      session: Object.values(sessionStorage),
      url: window.location.href,
    }));
    const serializedRequests = JSON.stringify(observedRequests);
    expect(browserState.local.every(value => !value.includes(schemaMarker) && !value.includes(instanceMarker))).toBe(true);
    expect(browserState.session.every(value => !value.includes(schemaMarker) && !value.includes(instanceMarker))).toBe(true);
    expect(browserState.url).not.toContain(schemaMarker);
    expect(browserState.url).not.toContain(instanceMarker);
    expect(serializedRequests).not.toContain(schemaMarker);
    expect(serializedRequests).not.toContain(instanceMarker);

    await page.reload();

    await expect(page.getByTestId('json-schema-source')).toHaveValue(/additionalProperties/);
    expect(await page.getByTestId('json-schema-source').inputValue()).not.toContain(schemaMarker);
    await expect(page.getByTestId('json-schema-instance')).toHaveValue(/Ada Lovelace/);
    expect(await page.getByTestId('json-schema-instance').inputValue()).not.toContain(instanceMarker);
    await expect(page.getByTestId('json-schema-status')).toContainText('only when you select Validate');
  });
});
