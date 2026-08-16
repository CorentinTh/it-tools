import { expect, test } from '@playwright/test';

test.describe('Network Calculation Suite', () => {
  test('calculates exact CIDR ranges and DHCP Option 43 bytes', async ({ page }) => {
    await page.goto('/network-calculation-suite');
    await expect(page.locator('.tool-header h1')).toHaveText('Network Calculation Suite');
    await page.getByTestId('network-suite-run').click();
    await expect(page.getByTestId('network-suite-output')).toHaveValue(/Network: 192\.0\.2\.16\/28/);
    await expect(page.getByTestId('network-suite-output')).toHaveValue(/Membership: inside/);

    await page.getByText('DHCP Option 43', { exact: true }).click();
    await page.getByTestId('network-suite-run').click();
    await expect(page.getByTestId('network-suite-output')).toHaveValue(/Hex: f108c0000201c6336402/);
  });
});
