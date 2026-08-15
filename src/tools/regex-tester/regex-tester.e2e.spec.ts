import { expect, test } from '@playwright/test';

const CATASTROPHIC_PATTERN = '(a+)+$';
const CATASTROPHIC_INPUT = `${'a'.repeat(80_000)}!`;

test.use({ serviceWorkers: 'block' });

test.describe('Tool - Regex Tester worker safety', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/regex-tester');
    await expect(page).toHaveTitle('Regex Tester - IT Tools');
  });

  test('terminates catastrophic backtracking without blocking the page', async ({ page }) => {
    test.setTimeout(15_000);
    await page.evaluate(() => {
      const heartbeat = { ticks: 0 };
      Reflect.set(window, '__regexHeartbeat', heartbeat);
      window.setInterval(() => {
        heartbeat.ticks += 1;
      }, 50);
    });

    await page.getByTestId('regex-pattern').fill(CATASTROPHIC_PATTERN);
    await page.getByTestId('regex-text').fill(CATASTROPHIC_INPUT);

    await expect(page.getByTestId('regex-match-status')).toContainText('Matching running');
    await expect(page.getByTestId('regex-match-status')).toContainText('time limit', { timeout: 5_000 });
    await expect(page.getByTestId('regex-pattern')).toBeVisible();
    await expect(page.getByText('No match')).toBeVisible();

    const heartbeatTicks = await page.evaluate(() => {
      const heartbeat = Reflect.get(window, '__regexHeartbeat') as { ticks: number };
      return heartbeat.ticks;
    });
    expect(heartbeatTicks).toBeGreaterThan(10);
  });

  test('cancels stale work and lets the latest input win', async ({ page }) => {
    test.setTimeout(15_000);
    await page.getByTestId('regex-pattern').fill(CATASTROPHIC_PATTERN);
    await page.getByTestId('regex-text').fill(CATASTROPHIC_INPUT);
    await expect(page.getByTestId('regex-match-status')).toContainText('Matching running');

    await page.getByTestId('regex-pattern').fill('b');
    await page.getByTestId('regex-text').fill('ab');

    await expect(page.getByTestId('regex-match-status')).toContainText('1 match found', { timeout: 5_000 });
    await expect(page.getByTestId('regex-matches')).toContainText('b');
    await expect(page.getByTestId('regex-sample-status')).toContainText('Sample generated');
    await expect(page.getByTestId('regex-sample')).toHaveText('b');
    await page.waitForTimeout(1_400);
    await expect(page.getByTestId('regex-match-status')).toContainText('1 match found');
  });

  test('terminates active work on client-side route leave', async ({ page }) => {
    test.setTimeout(15_000);
    await page.getByTestId('regex-pattern').fill(CATASTROPHIC_PATTERN);
    await page.getByTestId('regex-text').fill(CATASTROPHIC_INPUT);
    await expect(page.getByTestId('regex-match-status')).toContainText('Matching running');

    await page.getByLabel('Home').click();

    await expect(page).toHaveURL('/');
    await expect(page.getByTestId('regex-pattern')).toHaveCount(0);
    await expect(page.locator('.tool-card').first()).toBeVisible();
  });

  test('unmounts the previous content when navigating between tool routes', async ({ page }) => {
    const runtimeErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error' || message.type() === 'warning') {
        runtimeErrors.push(`${message.type()}: ${message.text()}`);
      }
    });
    page.on('pageerror', error => runtimeErrors.push(`pageerror: ${error.message}`));

    await page.getByTestId('regex-pattern').fill('a+');
    await page.getByTestId('regex-diagram-run').click();
    await expect(page.getByTestId('regex-diagram-status')).toContainText('Diagram rendered');
    await page.locator('a[href="/url-encoder"]').first().click();

    await expect(page).toHaveURL('/url-encoder');
    expect(runtimeErrors).toEqual([]);
    await expect(page.locator('.tool-header h1')).toContainText('URL');
    await expect(page.getByTestId('regex-pattern')).toHaveCount(0);
  });

  test('keeps the wide task layout, checkbox semantics, and mobile dark-mode flow', async ({ page }) => {
    const flags = page.getByRole('group', { name: 'Flags' });
    const globalFlag = page.getByRole('checkbox', { name: /Global search/ });

    await expect(flags).toBeVisible();
    await expect(flags.getByRole('checkbox')).toHaveCount(6);
    await expect(globalFlag).toBeChecked();
    await globalFlag.focus();
    await page.keyboard.press('Space');
    await expect(globalFlag).not.toBeChecked();

    const desktopWidths = await page.locator('.c-task-layout textarea').evaluateAll(elements => (
      elements.map(element => element.getBoundingClientRect().width)
    ));
    expect(desktopWidths).toHaveLength(2);
    expect(Math.abs(desktopWidths[0] - desktopWidths[1])).toBeLessThanOrEqual(1);

    await page.getByRole('button', { name: 'Toggle dark/light mode' }).click();
    await expect(page.locator('.app-root')).toHaveClass(/app-root--dark/);

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(flags).toBeVisible();

    const mobileLayout = await page.evaluate(() => {
      const options = document.querySelector('.c-choice-group__options');
      const optionRects = options
        ? [...options.children].map(element => element.getBoundingClientRect())
        : [];
      const workbench = document.querySelector('.c-tool-workbench')?.getBoundingClientRect();

      return {
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        workbenchWidth: workbench?.width ?? 0,
        optionLefts: optionRects.map(rect => Math.round(rect.left)),
      };
    });

    expect(mobileLayout.documentWidth).toBeLessThanOrEqual(mobileLayout.viewportWidth + 1);
    expect(mobileLayout.workbenchWidth).toBeLessThanOrEqual(mobileLayout.viewportWidth);
    expect(new Set(mobileLayout.optionLefts).size).toBe(1);

    const darkTheme = await page.evaluate(() => ({
      background: getComputedStyle(document.body).backgroundColor,
      choiceText: getComputedStyle(document.querySelector('.c-choice-group')!).color,
    }));
    expect(darkTheme.background).toBe('rgb(16, 16, 20)');
    expect(darkTheme.choiceText).toContain('255, 255, 255');
  });
});
