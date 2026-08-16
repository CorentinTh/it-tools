import { expect, test } from '@playwright/test';

test.describe('UUID and Identifier Workspace', () => {
  test('generates UUID v7 and decodes its embedded timestamp', async ({ page }) => {
    await page.goto('/uuid-generator');
    await expect(page.locator('.tool-header h1')).toHaveText('UUID & Identifier Workspace');
    await page.getByText('v7', { exact: true }).click();
    await page.getByTestId('uuid-generate').click();
    const generated = await page.getByTestId('uuid-output').inputValue();
    expect(generated).toMatch(/^[0-9a-f-]{14}7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);

    await page.getByTestId('identifier-input').fill(generated);
    await page.getByTestId('identifier-inspect').click();
    await expect(page.getByTestId('identifier-result')).toContainText('Embedded timestamp');
  });

  test('inspects a Mongo ObjectID without persisting it', async ({ page }) => {
    await page.goto('/uuid-generator');
    await page.getByText('Mongo ObjectID', { exact: true }).click();
    await page.getByTestId('identifier-input').fill('507f1f77bcf86cd799439011');
    await page.getByTestId('identifier-inspect').click();
    await expect(page.getByTestId('identifier-result')).toContainText('2012-10-17T21:13:27.000Z');
    await page.reload();
    await expect(page.getByTestId('identifier-input')).not.toHaveValue('507f1f77bcf86cd799439011');
  });
});
