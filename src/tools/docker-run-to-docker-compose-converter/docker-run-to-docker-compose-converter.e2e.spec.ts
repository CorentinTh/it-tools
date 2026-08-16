import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

test.describe('Docker Run to Compose bounded conversion', () => {
  test('converts after a pause and preserves categorized composerize messages', async ({ page }) => {
    await page.goto('/docker-run-to-docker-compose-converter');
    await expect(page.getByTestId('docker-converter-status')).toContainText('completed');
    await expect(page.getByTestId('area-content')).toContainText('services:');

    await page.getByTestId('docker-run-input').fill('docker run --rm --foo bar nginx');
    await expect(page.getByTestId('docker-converter-status')).toContainText('completed');
    await expect(page.getByText('The option "--rm" could not be translated to docker-compose.yml.')).toBeVisible();
    await expect(page.getByText('Unknown option: foo')).toBeVisible();
  });

  test('requires an explicit action for a large command and keeps its previous result', async ({ page }) => {
    await page.goto('/docker-run-to-docker-compose-converter');
    await expect(page.getByTestId('docker-converter-status')).toContainText('completed');
    const priorOutput = await page.getByTestId('area-content').textContent();
    const variables = Array.from({ length: 1_000 }, (_, index) => `-e KEY_${index}=value_${index}`).join(' ');
    await page.getByTestId('docker-run-input').fill(`docker run ${variables} nginx`);

    await expect(page.getByTestId('docker-converter-status')).toContainText('Large Docker commands run only on request');
    await expect(page.getByTestId('area-content')).toHaveText(priorOutput ?? '');
    await page.getByTestId('docker-converter-run').click();
    await expect(page.getByTestId('docker-converter-status')).toContainText('completed', { timeout: 15_000 });
    await expect(page.getByTestId('area-content')).toContainText('KEY_999=value_999');
  });

  test('converts Compose back to a safely quoted Docker run command', async ({ page }) => {
    await page.goto('/docker-run-to-docker-compose-converter');
    await page.getByRole('radio', { name: 'Compose → Docker run' }).click();
    await expect(page.getByTestId('docker-converter-status')).toContainText('completed');
    await expect(page.getByTestId('area-content')).toContainText('docker \\\nrun');
    await expect(page.getByTestId('area-content')).toContainText('APP_MODE=development');
    await expect(page.getByTestId('area-content')).toContainText('./site:/usr/share/nginx/html:ro');
  });
});
