import { expect, test } from '@playwright/test';

test.describe('SAML and Enterprise Timestamp Inspector', () => {
  test('decodes SAML with a visible non-verification warning and converts FILETIME', async ({ page }) => {
    await page.goto('/saml-enterprise-inspector');
    await expect(page.locator('.tool-header h1')).toHaveText('SAML & Enterprise Timestamp Inspector');
    await page.getByTestId('saml-enterprise-run').click();
    await expect(page.getByTestId('saml-enterprise-output')).toHaveValue(/Signature verification: NOT PERFORMED/);
    await expect(page.getByTestId('saml-enterprise-output')).toHaveValue(/Issuer: https:\/\/idp\.example/);

    await page.getByText('FILETIME → ISO', { exact: true }).click();
    await page.getByTestId('saml-enterprise-input').fill('116444736000000000');
    await page.getByTestId('saml-enterprise-run').click();
    await expect(page.getByTestId('saml-enterprise-output')).toHaveValue(/1970-01-01T00:00:00\.000Z/);
  });

  test('keeps assertions out of persistence', async ({ page }) => {
    await page.goto('/saml-enterprise-inspector');
    await page.getByTestId('saml-enterprise-input').fill(btoa('<Response>private-assertion</Response>'));
    await page.getByTestId('saml-enterprise-run').click();
    await expect(page.getByTestId('saml-enterprise-status')).toContainText('Signature not verified');
    await page.reload();
    await expect(page.getByTestId('saml-enterprise-input')).not.toHaveValue(/private-assertion/);
  });
});
