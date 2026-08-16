import { expect, test } from '@playwright/test';

test('SVG placeholder uses the shared responsive generator controls', async ({ page }) => {
  await page.goto('/svg-placeholder-generator');
  await expect(page).toHaveTitle('SVG placeholder generator - IT Tools');
  await expect(page.getByRole('spinbutton', { name: 'Width (px)' })).toHaveAttribute('aria-valuenow', '600');
  await expect(page.getByRole('spinbutton', { name: 'Height (px)' })).toHaveAttribute('aria-valuenow', '350');
  await expect(page.getByRole('spinbutton', { name: 'Font size (px)' })).toHaveAttribute('aria-valuenow', '26');
  await expect(page.getByRole('switch', { name: 'Use exact width and height' })).toBeChecked();
  await expect(page.getByRole('img', { name: 'Generated SVG placeholder preview' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copy SVG' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copy data URL' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Download SVG' })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test('Crontab uses one wide labelled field and shared mode switches', async ({ page }) => {
  await page.goto('/crontab-generator');
  await expect(page).toHaveTitle('Crontab generator - IT Tools');
  await expect(page.getByRole('textbox', { name: 'Cron expression' })).toBeVisible();
  await expect(page.getByRole('switch', { name: 'Verbose description' })).toBeChecked();
  await expect(page.getByRole('switch', { name: 'Use 24-hour time' })).toBeChecked();
  await expect(page.getByRole('switch', { name: 'Sunday is day 0' })).toBeChecked();

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test('WiFi QR uses shared labelled checkboxes in its vertical form', async ({ page }) => {
  await page.goto('/wifi-qrcode-generator');
  await expect(page).toHaveTitle('WiFi QR Code generator - IT Tools');
  await expect(page.getByRole('checkbox', { name: 'Hidden SSID' })).not.toBeChecked();
  await page.getByRole('checkbox', { name: 'Hidden SSID' }).check();
  await expect(page.getByRole('checkbox', { name: 'Hidden SSID' })).toBeChecked();

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test('Chmod exposes a labelled permission matrix and full-width result card', async ({ page }) => {
  await page.goto('/chmod-calculator');
  await expect(page).toHaveTitle('Chmod calculator - IT Tools');
  await expect(page.getByTestId('chmod-octal')).toHaveText('000');
  await page.getByRole('checkbox', { name: 'owner read' }).check();
  await page.getByRole('checkbox', { name: 'owner write' }).check();
  await page.getByRole('checkbox', { name: 'owner execute' }).check();
  await expect(page.getByTestId('chmod-octal')).toHaveText('700');
  await expect(page.getByTestId('chmod-symbolic')).toHaveText('rwx------');

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test('QR generator uses the shared keyboard-operable color picker contract', async ({ page }) => {
  await page.goto('/qrcode-generator');
  await expect(page).toHaveTitle('QR Code generator - IT Tools');
  const foreground = page.getByRole('button', { name: 'Foreground color' });
  await foreground.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.n-color-picker-panel')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('img', { name: 'Generated QR code' })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test('Color converter uses responsive top-labelled fields without fixed label widths', async ({ page }) => {
  await page.goto('/color-converter');
  await expect(page).toHaveTitle('Color converter - IT Tools');
  await expect(page.getByRole('button', { name: 'color picker' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'hex' })).toHaveValue('#1ea54c');

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test('BIP39 uses the generator rhythm with accessible entropy actions', async ({ page }) => {
  await page.goto('/bip39-generator');
  await expect(page).toHaveTitle('BIP39 passphrase generator - IT Tools');
  await expect(page.getByRole('button', { name: 'Generate new entropy' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copy entropy' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Entropy (seed)' }).fill('00000000000000000000000000000000');
  await expect(page.getByRole('textbox', { name: 'Passphrase (mnemonic)' })).toHaveValue(/abandon/);

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test('Benchmark builder uses responsive suites and labelled numeric measures', async ({ page }) => {
  await page.goto('/benchmark-builder');
  await expect(page).toHaveTitle('Benchmark builder - IT Tools');
  const firstMeasure = page.getByRole('spinbutton', { name: 'Suite 1 measure 1' });
  await expect(firstMeasure).toHaveValue('5');
  await firstMeasure.fill('10');
  await expect(firstMeasure).toHaveAttribute('aria-valuenow', '10');

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test('Hash Text renders labelled digest fields below its full-width input', async ({ page }) => {
  await page.goto('/hash-text');
  await expect(page).toHaveTitle('Hash text - IT Tools');
  await page.getByRole('textbox', { name: 'Text to hash' }).fill('abc');
  await expect(page.getByRole('textbox', { name: 'SHA256' })).toHaveValue('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test('Keycode Info renders a responsive labelled detail grid after a key press', async ({ page }) => {
  await page.goto('/keycode-info');
  await expect(page).toHaveTitle('Keycode info - IT Tools');
  await page.keyboard.press('Shift+KeyA');
  await expect(page.getByRole('textbox', { name: 'Key', exact: true })).toHaveValue('A');
  await expect(page.getByRole('textbox', { name: 'Modifiers' })).toHaveValue('Shift');

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test('Open Graph generator uses full-width section cards and labelled fields', async ({ page }) => {
  await page.goto('/og-meta-generator');
  await expect(page).toHaveTitle('Open graph meta generator - IT Tools');
  await page.getByRole('textbox', { name: 'Title' }).fill('Unified tools');
  await expect(page.getByTestId('area-content')).toContainText('Unified tools');

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test('IPv4 converter uses labelled responsive input and output cards', async ({ page }) => {
  await page.goto('/ipv4-address-converter');
  await expect(page).toHaveTitle('IPv4 address converter - IT Tools');
  await expect(page.getByRole('textbox', { name: 'Decimal', exact: true })).toHaveValue('3232235777');
  await expect(page.getByRole('textbox', { name: 'IPv6', exact: true })).toHaveValue(/ffff/);

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test('URL parser stacks labelled property and query parameter cards', async ({ page }) => {
  await page.goto('/url-parser');
  await expect(page).toHaveTitle('URL parser - IT Tools');
  await expect(page.getByRole('textbox', { name: 'Protocol' })).toHaveValue('https:');
  await expect(page.getByText('Query parameters', { exact: true })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test('Case converter uses a responsive labelled result grid', async ({ page }) => {
  await page.goto('/case-converter');
  await expect(page).toHaveTitle('Case converter - IT Tools');
  await page.getByRole('textbox', { name: 'String to convert' }).fill('Hello unified UI');
  await expect(page.getByRole('textbox', { name: 'Camelcase' })).toHaveValue('helloUnifiedUi');

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test('Encryption uses equal responsive secret and algorithm fields above each output', async ({ page }) => {
  await page.goto('/encryption');
  await expect(page).toHaveTitle('Encrypt / decrypt text - IT Tools');
  await expect(page.getByRole('textbox', { name: 'Your text encrypted:' })).not.toHaveValue('');
  await expect(page.getByRole('combobox', { name: 'Encryption algorithm' }).first()).toContainText('AES');

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test('HMAC uses a responsive option grid and full-width labelled result', async ({ page }) => {
  await page.goto('/hmac-generator');
  await expect(page).toHaveTitle('Hmac generator - IT Tools');
  await page.getByRole('textbox', { name: 'Message (UTF-8)' }).fill('abc');
  await page.getByRole('textbox', { name: 'Secret key' }).fill('key');
  await page.getByRole('button', { name: 'Compute HMAC' }).click();
  await expect(page.getByRole('textbox', { name: 'HMAC', exact: true })).toHaveValue('9c196e32dc0175f86f4b1cb89289d6619de6bee699e4c378e68309ed97a1a6ab');

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test('Basic Auth uses the generator rhythm without a compact output cap', async ({ page }) => {
  await page.goto('/basic-auth-generator');
  await expect(page).toHaveTitle('Basic auth generator - IT Tools');
  await page.getByRole('textbox', { name: 'Username' }).fill('user');
  await page.getByLabel('Password', { exact: true }).fill('pass');
  await expect(page.getByRole('textbox', { name: 'Authorization header' })).toHaveValue('Authorization: Basic dXNlcjpwYXNz');

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test('PDF signature checker keeps its local upload workbench full width', async ({ page }) => {
  await page.goto('/pdf-signature-checker');
  await expect(page).toHaveTitle('PDF signature checker - IT Tools');
  await expect(page.getByRole('button', { name: /Drag and drop a PDF file/ })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});
