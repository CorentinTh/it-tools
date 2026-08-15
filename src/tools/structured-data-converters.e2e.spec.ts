import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

test.describe('Bounded structured-data converters', () => {
  test('JSON conversion requires an explicit action above the live threshold', async ({ page }) => {
    await page.goto('/json-to-yaml-converter');
    const source = `{"value":"${'a'.repeat(70 * 1024)}"}`;
    await page.getByTestId('input').fill(source);

    await expect(page.getByTestId('converter-status')).toContainText('Large input runs only on request');
    await expect(page.getByTestId('area-content')).toHaveText('');
    await page.getByTestId('converter-run').click();
    await expect(page.getByTestId('converter-status')).toContainText('completed');
    await expect(page.getByTestId('area-content')).toContainText('value:');
  });

  test('YAML conversion retains the previous result after a malformed edit', async ({ page }) => {
    await page.goto('/yaml-to-json-converter');
    await page.getByTestId('input').fill('value: worker');
    await expect(page.getByTestId('converter-status')).toContainText('completed');
    await expect(page.getByTestId('area-content')).toContainText('"value": "worker"');

    await page.getByTestId('input').fill('value: [');
    await page.getByTestId('converter-run').click();
    await expect(page.getByTestId('converter-status')).toContainText('previous result remains available');
    await expect(page.getByTestId('area-content')).toContainText('"value": "worker"');
  });

  test('TOML conversion uses the same explicit large-input lifecycle', async ({ page }) => {
    await page.goto('/toml-to-json');
    await page.getByTestId('input').fill(`value = "${'a'.repeat(70 * 1024)}"`);

    await expect(page.getByTestId('converter-status')).toContainText('Large input runs only on request');
    await page.getByTestId('converter-run').click();
    await expect(page.getByTestId('converter-status')).toContainText('completed');
    await expect(page.getByTestId('area-content')).toContainText('"value"');
  });

  test('XML conversion requires an explicit action above the live threshold', async ({ page }) => {
    await page.goto('/xml-to-json');
    await page.getByTestId('input').fill(`<value>${'Привет 👋'.repeat(8_000)}</value>`);

    await expect(page.getByTestId('converter-status')).toContainText('Large input runs only on request');
    await page.getByTestId('converter-run').click();
    await expect(page.getByTestId('converter-status')).toContainText('completed');
    await expect(page.getByTestId('area-content')).toHaveValue(/Привет/);
  });

  test('JSON to XML retains the previous result after malformed JSON5', async ({ page }) => {
    await page.goto('/json-to-xml');
    await page.getByTestId('input').fill('{message:{_text:"worker"}}');
    await expect(page.getByTestId('converter-status')).toContainText('completed');
    await expect(page.getByTestId('area-content')).toContainText('<message>worker</message>');

    await page.getByTestId('input').fill('{message:');
    await page.getByTestId('converter-run').click();
    await expect(page.getByTestId('converter-status')).toContainText('previous result remains available');
    await expect(page.getByTestId('area-content')).toContainText('<message>worker</message>');
  });
});
