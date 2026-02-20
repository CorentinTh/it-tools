import { expect, test } from '@playwright/test';

test.describe('Mermaid Diagram Renderer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mermaid-exporter');
  });

  test('should render the initial diagram', async ({ page }) => {
    const diagramContainer = page.locator('.diagram-container svg');
    await expect(diagramContainer).toBeVisible();
    await expect(diagramContainer).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
  });

  test('should update diagram when user edits Mermaid code', async ({ page }) => {
    const input = page.getByLabel('Your Mermaid to convert:');
    const updatedMermaid = `
      graph LR
      X[Start] --> Y{Working?}
      Y -- Yes --> Z[Success!]
      Y -- No --> W[Fix again!]
    `;
    await input.fill(updatedMermaid);
    await page.waitForTimeout(500);

    const svg = page.locator('.diagram-container svg');
    await expect(svg).toContainText('Start');
    await expect(svg).toContainText('Success!');
  });

  test('should allow exporting in SVG, PNG, and JPG', async ({ page }) => {
    const formats = ['svg', 'png', 'jpg'];

    for (const format of formats) {
      const button = page.getByRole('button', { name: new RegExp(`Export as ${format}`, 'i') });
      await expect(button).toBeVisible();
      await button.click();
    }
  });
});
