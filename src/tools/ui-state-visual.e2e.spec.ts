import process from 'node:process';
import { type Locator, type Page, expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

type ScreenshotOptions = NonNullable<Parameters<ReturnType<typeof expect<Locator>>['toHaveScreenshot']>[0]>;

const screenshotOptions: ScreenshotOptions = {
  animations: 'disabled' as const,
  caret: 'hide' as const,
  maxDiffPixelRatio: 0.02,
  threshold: 0.25,
};

async function expectDarwinScreenshot(
  locator: Locator,
  name: string,
  options: ScreenshotOptions = screenshotOptions,
): Promise<void> {
  // Pixel output varies with the host font renderer. Keep state assertions portable,
  // and compare the checked-in baseline on the workstation where it was recorded.
  if (process.platform !== 'darwin') {
    return;
  }

  await expect(locator).toHaveScreenshot(name, options);
}

async function stabilizeVisuals(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        caret-color: transparent !important;
        transition: none !important;
      }
    `,
  });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  });
}

function toolContent(page: Page): Locator {
  return page.locator('.tool-content');
}

test.describe('Representative UI state visuals', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Visual baselines use the mandatory Chromium UI contract.');

  test('explicit task loading keeps controls disabled and status/actions stable', async ({ page }) => {
    await page.addInitScript(() => {
      class PendingWorker {
        onerror: ((event: ErrorEvent) => void) | null = null;
        onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
        onmessageerror: ((event: MessageEvent<unknown>) => void) | null = null;

        postMessage(): void {}
        terminate(): void {}
      }

      Object.defineProperty(window, 'Worker', { configurable: true, value: PendingWorker });
    });
    await page.setViewportSize({ width: 1_280, height: 900 });
    await page.goto('/rsa-key-pair-generator');
    await page.getByTestId('3072').focus();
    await page.getByTestId('rsa-generate').click();

    await expect(page.getByTestId('rsa-generate')).toBeDisabled();
    await expect(page.getByRole('radiogroup', { name: 'Key size' })).toHaveAttribute('aria-disabled', 'true');
    await expect(page.getByTestId('rsa-cancel')).toBeVisible();
    await expect(page.getByTestId('rsa-status')).toContainText('Generating a 2,048-bit');

    await stabilizeVisuals(page);
    await expectDarwinScreenshot(toolContent(page), 'explicit-task-loading.png');
  });

  test('validation errors remain readable in the mobile dark layout', async ({ page }) => {
    await page.setViewportSize({ width: 1_280, height: 900 });
    await page.goto('/json-schema-validator');
    await page.getByRole('button', { name: 'Toggle dark/light mode' }).click();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByTestId('json-schema-source').fill('{"type":"object","properties":{"count":{"type":"integer","minimum":1}},"required":["count"],"additionalProperties":false}');
    await page.getByTestId('json-schema-instance').fill('{"count":0,"extra":true}');
    await page.getByTestId('json-schema-validate').click();
    await expect(page.getByTestId('json-schema-status')).toContainText('2 validation errors found', { timeout: 15_000 });
    await expect(page.getByTestId('json-schema-errors').locator('li')).toHaveCount(2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);

    await stabilizeVisuals(page);
    await expectDarwinScreenshot(page.getByTestId('json-schema-errors'), 'mobile-dark-validation-error.png', {
      ...screenshotOptions,
      mask: [
        page.getByTestId('json-schema-source'),
        page.getByTestId('json-schema-instance'),
      ],
    });
  });

  test('long dense-form values preserve the desktop result rhythm', async ({ page }) => {
    await page.setViewportSize({ width: 1_280, height: 900 });
    await page.goto('/wifi-qrcode-generator');
    await expect(page.getByTestId('wifi-qrcode-status')).toContainText('Complete the required WiFi fields');
    await page.getByRole('textbox', { name: 'SSID' }).fill('engineering-office-network-with-a-deliberately-long-visible-name');
    await page.getByLabel('Password', { exact: true }).fill('local-only-password-with-a-long-value');
    await expect(page.getByTestId('wifi-qrcode-status')).toHaveText('WiFi QR code ready.');
    await expect(page.getByTestId('wifi-qrcode-result')).toBeVisible();

    await stabilizeVisuals(page);
    await expectDarwinScreenshot(toolContent(page), 'dense-form-long-value-result.png', {
      ...screenshotOptions,
      mask: [
        page.getByRole('textbox', { name: 'SSID' }),
        page.getByLabel('Password', { exact: true }),
        page.getByRole('img', { name: 'WiFi QR code' }),
      ],
    });
  });

  test('live transformer keeps long invalid input and error actions in one vertical flow', async ({ page }) => {
    await page.setViewportSize({ width: 1_280, height: 900 });
    await page.goto('/xml-formatter');
    const input = page.getByTestId('input');
    await expect(page.getByTestId('xml-format-status')).toContainText('completed');
    await input.fill(`not-xml-${'long-value-'.repeat(30)}`);

    await expect(page.getByTestId('xml-format-status')).toContainText('previous result remains available');
    await expect(page.getByTestId('xml-format-run')).toBeEnabled();
    await expect(page.getByText('Formatted XML from your XML')).toBeVisible();

    await stabilizeVisuals(page);
    await expectDarwinScreenshot(toolContent(page), 'live-transformer-error-long-value.png', {
      ...screenshotOptions,
      mask: [input],
    });
  });

  test('local-file inspector exposes the empty disabled state and legacy guidance', async ({ page }) => {
    await page.setViewportSize({ width: 1_280, height: 900 });
    await page.goto('/file-hash');

    await expect(page.getByTestId('file-hash-run')).toBeDisabled();
    await expect(page.getByTestId('file-hash-clear')).toBeEnabled();
    await expect(page.getByTestId('file-hash-legacy-SHA-1')).toHaveText('(legacy)');
    await expect(page.getByTestId('file-hash-legacy-MD5')).toHaveText('(legacy)');
    await expect(page.getByTestId('file-hash-status')).toContainText('Select a local file');

    await stabilizeVisuals(page);
    await expectDarwinScreenshot(toolContent(page), 'local-file-empty-disabled.png');
  });

  test('true diff result keeps aligned arrays readable without abandoning peer editors', async ({ page }) => {
    await page.setViewportSize({ width: 1_280, height: 900 });
    await page.goto('/json-diff');
    const left = page.getByTestId('leftJson');
    const right = page.getByTestId('rightJson');
    await left.fill('[{"id":"service-a","port":8080},{"id":"service-b","port":8081}]');
    await right.fill('[{"id":"service-b","port":9090},{"id":"service-a","port":8080}]');
    await page.getByTestId('json-diff-run').click();

    await expect(page.getByTestId('json-diff-status')).toContainText('1 array aligned by key/LCS');
    await expect(page.getByTestId('diff-result')).toContainText('9090');

    await stabilizeVisuals(page);
    await expectDarwinScreenshot(toolContent(page), 'true-diff-aligned-result.png', {
      ...screenshotOptions,
      mask: [left, right],
    });
  });

  test('searchable reference remains compact with a long query on mobile dark', async ({ page }) => {
    await page.setViewportSize({ width: 1_280, height: 900 });
    await page.goto('/http-status-codes');
    await page.getByRole('button', { name: 'Toggle dark/light mode' }).click();
    await page.setViewportSize({ width: 390, height: 844 });
    const search = page.getByRole('textbox', { name: 'HTTP status code, name, or description' });
    await search.fill('This and all future requests should be directed to the given URI.');

    await expect(page.getByRole('heading', { name: 'Search results' })).toBeVisible();
    await expect(page.getByText('301 Moved Permanently')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);

    await stabilizeVisuals(page);
    await expectDarwinScreenshot(toolContent(page), 'reference-mobile-dark-long-query.png');
  });
});
