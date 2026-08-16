import { expect, test } from '@playwright/test';

test.describe('DevOps Configuration Workspace', () => {
  test('lints Dockerfiles and normalizes Compose locally', async ({ page }) => {
    await page.goto('/devops-config-workspace');
    await expect(page.locator('.tool-header h1')).toHaveText('DevOps Configuration Workspace');
    await page.getByTestId('devops-config-run').click();
    await expect(page.getByTestId('devops-config-output')).toHaveValue(/pin FROM/);

    await page.getByText('Compose validate', { exact: true }).click();
    await page.getByTestId('devops-config-run').click();
    await expect(page.getByTestId('devops-config-output')).toHaveValue(/services:/);
    await expect(page.getByTestId('devops-config-output')).not.toHaveValue(/version:/);
  });

  test('converts properties to YAML without persisting input', async ({ page }) => {
    await page.goto('/devops-config-workspace');
    await page.getByText('Properties → YAML', { exact: true }).click();
    await page.getByTestId('devops-config-input').fill('secret.value=local-only');
    await page.getByTestId('devops-config-run').click();
    await expect(page.getByTestId('devops-config-output')).toHaveValue(/secret:/);
    await page.reload();
    await expect(page.getByTestId('devops-config-input')).not.toHaveValue(/local-only/);
  });
});
