import { expect, test } from '@playwright/test';

test.describe('Tool - IPv6 calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ipv6-calculator');
  });

  test('calculates exact network bounds, membership, and subnet split', async ({ page }) => {
    await expect(page).toHaveTitle('IPv6 calculator - IT Tools');
    await page.getByTestId('ipv6-cidr').fill('2001:db8:abcd:12::dead:beef/64');
    await page.getByTestId('ipv6-membership-address').fill('2001:db8:abcd:12::42');
    await page.getByTestId('ipv6-split-prefix').fill('66');
    await expect(page.getByTestId('ipv6-stale')).toBeVisible();
    await page.getByTestId('ipv6-calculate').click();

    await expect(page.getByTestId('ipv6-result')).toContainText('2001:db8:abcd:12::/64');
    await expect(page.getByTestId('ipv6-result')).toContainText('2001:db8:abcd:12:ffff:ffff:ffff:ffff');
    await expect(page.getByTestId('ipv6-result')).toContainText('18,446,744,073,709,551,616');
    await expect(page.getByTestId('ipv6-membership-result')).toHaveText('Inside network');
    await expect(page.getByTestId('ipv6-subnets')).toHaveValue(/2001:db8:abcd:12:4000::\/66/);
  });

  test('keeps previous results while reporting malformed input', async ({ page }) => {
    const previous = await page.getByTestId('ipv6-result').textContent();
    await page.getByTestId('ipv6-cidr').fill('not-an-ipv6/64');
    await page.getByTestId('ipv6-calculate').click();
    await expect(page.getByTestId('ipv6-error')).toBeVisible();
    await expect(page.getByTestId('ipv6-result')).toHaveText(previous ?? '');
  });
});
