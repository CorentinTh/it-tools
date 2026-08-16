import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

test.describe('Tool - Ed25519 and SSH key workspace', () => {
  test('generates compatible local formats only after an explicit action', async ({ page }) => {
    await page.goto('/ed25519-key-workspace');
    await expect(page).toHaveTitle('Ed25519 & SSH Key Workspace - IT Tools');
    await expect(page.getByTestId('ed25519-results')).toHaveCount(0);
    await page.getByTestId('ed25519-comment').fill('dev@example.com');
    await page.getByTestId('ed25519-generate').click();
    await expect(page.getByTestId('ed25519-status')).toContainText(/Generated locally|does not support Ed25519/, { timeout: 30_000 });
    if (await page.getByTestId('ed25519-error').isVisible()) {
      await expect(page.getByTestId('ed25519-error')).toContainText('does not support Ed25519');
      await expect(page.getByTestId('ed25519-results')).toHaveCount(0);
      return;
    }
    await expect(page.getByText(/^ssh-ed25519 /)).toContainText('dev@example.com');
    await expect(page.getByText(/^SHA256:/)).toBeVisible();
    await expect(page.getByTestId('ed25519-private-key')).toContainText('BEGIN PRIVATE KEY');
  });

  test('does not persist private material and clears it on reload', async ({ page }) => {
    await page.goto('/ed25519-key-workspace');
    await page.getByTestId('ed25519-generate').click();
    await expect(page.getByTestId('ed25519-status')).toContainText(/Generated locally|does not support Ed25519/, { timeout: 30_000 });
    if (await page.getByTestId('ed25519-error').isVisible()) {
      await expect(page.getByTestId('ed25519-results')).toHaveCount(0);
      return;
    }
    const privateText = await page.getByTestId('ed25519-private-key').textContent();
    expect(privateText).toContain('BEGIN PRIVATE KEY');
    const stored = await page.evaluate(() => [...Object.values(localStorage), ...Object.values(sessionStorage)].join('\n'));
    expect(stored).not.toContain(privateText ?? 'impossible-private-key');
    await page.reload();
    await expect(page.getByTestId('ed25519-results')).toHaveCount(0);
  });
});
