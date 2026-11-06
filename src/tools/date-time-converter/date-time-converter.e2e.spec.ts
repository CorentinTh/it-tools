import { expect, test } from '@playwright/test';

test.describe('Date time converter - json to yaml', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/date-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Date-time converter - IT Tools');
  });

  test('Format is auto detected from a date and the date is correctly converted', async ({ page }) => {
    const initialFormat = await page.getByTestId('date-time-converter-format-select').innerText();
    expect(initialFormat.trim()).toEqual('Timestamp');

    await page.getByTestId('date-time-converter-input').fill('2023-04-12T23:10:24+02:00');

    const detectedFormat = await page.getByTestId('date-time-converter-format-select').innerText();
    expect(detectedFormat.trim()).toEqual('ISO 8601');

    expect((await page.getByTestId('JS locale date string').inputValue()).trim()).toEqual(
      'Wed Apr 12 2023 23:10:24 GMT+0200 (Central European Summer Time)',
    );
    expect((await page.getByTestId('ISO 8601').inputValue()).trim()).toEqual('2023-04-12T23:10:24+02:00');
    expect((await page.getByTestId('ISO 9075').inputValue()).trim()).toEqual('2023-04-12 23:10:24');
    expect((await page.getByTestId('Unix timestamp').inputValue()).trim()).toEqual('1681333824');
    expect((await page.getByTestId('RFC 7231').inputValue()).trim()).toEqual('Wed, 12 Apr 2023 21:10:24 GMT');
    expect((await page.getByTestId('RFC 3339').inputValue()).trim()).toEqual('2023-04-12T23:10:24+02:00');
    expect((await page.getByTestId('Timestamp').inputValue()).trim()).toEqual('1681333824000');
    expect((await page.getByTestId('UTC format').inputValue()).trim()).toEqual('Wed, 12 Apr 2023 21:10:24 GMT');
    expect((await page.getByTestId('Mongo ObjectID').inputValue()).trim()).toEqual('64371e400000000000000000');
    expect((await page.getByTestId('Excel date/time').inputValue()).trim()).toEqual('45028.88222222222');
  });
});
