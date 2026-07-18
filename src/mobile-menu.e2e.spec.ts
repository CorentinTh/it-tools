import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

test('restores focus when the mobile navigation is hidden with Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const toggle = page.getByRole('button', { name: 'Toggle menu' });
  const navigation = page.getByTestId('tool-navigation');

  await expect(toggle).toHaveAttribute('aria-controls', 'tool-navigation');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(navigation).toHaveAttribute('inert', '');

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(navigation).not.toHaveAttribute('inert', '');

  const firstToolLink = navigation.locator('a[href]').first();
  await firstToolLink.focus();
  await expect(firstToolLink).toBeFocused();
  await page.keyboard.press('Escape');

  await expect(navigation).toHaveAttribute('inert', '');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();

  await toggle.click();
  await navigation.locator('a[href="/json-prettify"]').click();

  await expect(page).toHaveURL('/json-prettify');
  await expect(navigation).toHaveAttribute('inert', '');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});
