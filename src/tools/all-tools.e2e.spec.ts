import { expect, test } from '@playwright/test';

const ignoredHrefs = new Set(['/camera-recorder']);

test.describe('IT Tool', () => {
  test('Loads all tools correctly', async ({ page }) => {
    test.slow();

    const allTools: string[] = [];

    await page.goto('/');
    await page.waitForSelector('.it-tool-link');
    const allLinks = await page.locator('.it-tool-link').all();
    for (const a of allLinks) {
      allTools.push((await a.getAttribute('href')) || '/');
    }

    expect(allTools.length).toBeGreaterThan(0);

    const errors: Array<Error> = [];

    page.on('pageerror', (error) => {
      // ignore errors related to physical devices (ie camera recorder)
      if (error.message.match(/Requested device not found/)) {
        return;
      }
      errors.push(error);
    });

    for (const toolHref of allTools) {
      if (ignoredHrefs.has(toolHref)) {
        continue;
      }
      await test.step(toolHref, async () => {
        errors.splice(0, errors.length);

        await page.goto(toolHref);
        await page.waitForSelector('.tool-header');

        await expect(page).toHaveTitle(/.+ - IT Tools/);

        expect(errors, `${toolHref} to have no JS error`).toHaveLength(0);
      });
    }
  });
});
