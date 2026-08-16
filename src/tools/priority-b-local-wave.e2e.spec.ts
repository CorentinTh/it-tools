import { expect, test } from '@playwright/test';

test.describe('Priority B local utility wave', () => {
  test('compares lists in the bounded worker', async ({ page }) => {
    await page.goto('/list-comparison');
    await page.locator('[data-test-id="list-comparison-run"]').click();
    await expect(page.locator('[data-test-id="list-comparison-output"] textarea')).toHaveValue(/Only in left \(1\)\nalpha/u);
  });

  test('inspects Unicode and GSM-7 semantics', async ({ page }) => {
    await page.goto('/unicode-gsm-inspector');
    await page.locator('[data-test-id="unicode-gsm-run"]').click();
    await expect(page.locator('[data-test-id="unicode-gsm-output"] textarea')).toHaveValue(/SMS encoding estimate: UCS-2/u);
    await expect(page.locator('[data-test-id="unicode-gsm-output"] textarea')).toHaveValue(/U\+1F469/u);
  });

  test('converts a strict Gregorian date to an ISO week date', async ({ page }) => {
    await page.goto('/date-calendar-utilities');
    await page.locator('[data-test-id="calendar-date"]').fill('2021-01-01');
    await page.locator('[data-test-id="calendar-run"]').click();
    await expect(page.locator('[data-test-id="calendar-output"] textarea')).toHaveValue(/2020-W53-5/u);
  });

  test('authors redacted HTTP code without sending a request', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', request => requests.push(request.url()));
    await page.goto('/http-request-code-builder');
    const before = requests.length;
    await page.locator('[data-test-id="http-builder-build"]').click();
    await expect(page.locator('[data-test-id="http-builder-output"] textarea')).toHaveValue(/<redacted>/u);
    expect(requests.slice(before).filter(url => url.includes('api.example.test'))).toEqual([]);
  });

  test('imports the supported cURL subset without execution', async ({ page }) => {
    await page.goto('/http-request-code-builder');
    await page.getByLabel('Workflow').click();
    await page.getByText('Import supported cURL', { exact: true }).click();
    await page.locator('[data-test-id="http-builder-curl-input"]').fill('curl -XPUT -H \'Accept: application/json\' --data-raw \'{"ok":true}\' https://api.example.test/items');
    await page.locator('[data-test-id="http-builder-import"]').click();
    await expect(page.locator('[data-test-id="http-builder-url"]')).toHaveValue('https://api.example.test/items');
    await expect(page.getByRole('status')).toContainText('Imported the supported cURL subset');
  });
});
