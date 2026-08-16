import { expect, test } from '@playwright/test';

test.describe('URL Safety and Authoring Workspace', () => {
  test('removes trackers without echoing their values and defangs explicitly', async ({ page }) => {
    await page.goto('/url-encoder');
    await expect(page.locator('.tool-header h1')).toHaveText('URL Safety & Authoring Workspace');
    await page.getByTestId('url-safety-input').fill('https://example.com/path?utm_source=secret-value&keep=1');
    await page.getByTestId('url-remove-trackers').click();
    await expect(page.getByTestId('url-safety-output')).toHaveValue('https://example.com/path?keep=1');
    await expect(page.getByTestId('url-removed-parameters')).toContainText('utm_source');
    await expect(page.getByTestId('url-removed-parameters')).not.toContainText('secret-value');

    await page.getByTestId('url-defang').click();
    await expect(page.getByTestId('url-safety-output')).toHaveValue('hxxps://example[.]com/path?utm_source=secret-value&keep=1');
  });

  test('builds UTM and text-fragment URLs without persisting input', async ({ page }) => {
    await page.goto('/url-encoder');
    await page.getByTestId('url-safety-input').fill('https://example.com/article?private=secret-value');
    await page.getByTestId('url-build-utm').click();
    await expect(page.getByTestId('url-safety-output')).toHaveValue(/utm_source=newsletter/);
    await page.getByTestId('url-build-fragment').click();
    await expect(page.getByTestId('url-safety-output')).toHaveValue(/#:~:text=important%20text$/);

    await page.reload();
    await expect(page.getByTestId('url-safety-input')).not.toHaveValue(/secret-value/);
  });
});
