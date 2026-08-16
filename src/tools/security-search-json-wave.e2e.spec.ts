import { expect, test } from '@playwright/test';

test.describe('Security, search, and JSON wave', () => {
  test('round-trips Ansible Vault 1.1 in a disposable worker', async ({ page }) => {
    await page.goto('/devops-secret-helper');
    await page.getByLabel('Plaintext').fill('local secret\n');
    await page.getByLabel('Password', { exact: true }).fill('correct horse battery staple');
    await page.getByTestId('devops-secret-run').click();
    await expect(page.getByRole('status')).toContainText('Completed locally');
    const vault = await page.getByLabel('Output').inputValue();
    expect(vault).toMatch(/^\$ANSIBLE_VAULT;1\.1;AES256/u);

    await page.getByRole('radio', { name: 'Vault decrypt' }).click();
    await page.getByLabel('Ansible Vault text').fill(vault);
    await page.getByTestId('devops-secret-run').click();
    await expect(page.getByRole('status')).toContainText('Completed locally');
    await expect(page.getByLabel('Output')).toHaveValue('local secret\n');
  });

  test('generates and verifies an Apache bcrypt htpasswd entry', async ({ page }) => {
    await page.goto('/devops-secret-helper');
    await page.getByRole('radio', { name: 'htpasswd generate' }).click();
    await page.getByLabel('Username').fill('deploy');
    await page.getByLabel('Password', { exact: true }).fill('browser-only password');
    await page.getByTestId('devops-secret-run').click();
    await expect(page.getByRole('status')).toContainText('Completed locally');
    const entry = await page.getByLabel('Output').inputValue();
    expect(entry).toMatch(/^deploy:\$2y\$10\$/u);

    await page.getByRole('radio', { name: 'htpasswd verify' }).click();
    await page.getByLabel('bcrypt htpasswd entry').fill(entry);
    await page.getByTestId('devops-secret-run').click();
    await expect(page.getByLabel('Output')).toHaveValue('Password matches the bcrypt entry for deploy.');
  });

  test('unescapes an explicit outer JSON string without changing numeric lexemes', async ({ page }) => {
    await page.goto('/json-repair-query');
    await page.getByRole('radio', { name: 'Unescape JSON string' }).click();
    const inner = '{"id":9007199254740993,"ok":true}';
    await page.getByTestId('json-workspace-input').fill(JSON.stringify(inner));
    await page.getByTestId('json-workspace-run').click();
    await expect(page.getByTestId('json-workspace-status')).toContainText('Completed');
    await expect(page.getByTestId('json-workspace-output')).toHaveValue(inner);
  });

  test('exposes all bounded command-palette results instead of silently truncating them', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Search/u }).click();
    await page.getByPlaceholder('Type to search a tool or a command...').fill('json');
    const showAll = page.getByTestId('command-palette-show-all');
    await expect(showAll).toBeVisible();
    const before = await page.locator('[role="option"]').count();
    await showAll.click();
    await expect(page.getByTestId('command-palette-show-all')).toHaveCount(0);
    expect(await page.locator('[role="option"]').count()).toBeGreaterThan(before);
  });
});
