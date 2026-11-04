import { expect, test } from '@playwright/test';

test.describe('Tool - UUID generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/uuid-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('UUIDs generator - Toolbox');
  });

  for (const [uuidVersion, versionDigit] of [['v6', '6'], ['v7', '7']] as const) {
    test(`Generates ${uuidVersion} UUIDs in ascending order`, async ({ page }) => {
      await page.getByRole('button', { name: uuidVersion, exact: true }).click();
      await page.getByPlaceholder('UUID quantity').fill('10');

      const uuidPattern = new RegExp(`^[0-9a-f]{8}-[0-9a-f]{4}-${versionDigit}[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$`);
      await expect.poll(async () => (await page.getByTestId('uuids').inputValue()).split('\n').length).toEqual(10);
      const uuids = (await page.getByTestId('uuids').inputValue()).split('\n');

      for (const uuid of uuids) {
        expect(uuid).toMatch(uuidPattern);
      }
      expect(uuids).toEqual([...uuids].sort());
    });
  }

  test('Accepts a v7 UUID as the v5 namespace', async ({ page }) => {
    await page.getByRole('button', { name: 'v5', exact: true }).click();
    await page.getByTestId('namespace').fill('017f22e2-79b0-7cc3-98c4-dc0c0c07398f');
    await page.getByTestId('name').fill('www.example.com');

    await expect(page.getByText('Invalid UUID')).toBeHidden();
    await expect(page.getByTestId('uuids')).toHaveValue(/^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });
});
