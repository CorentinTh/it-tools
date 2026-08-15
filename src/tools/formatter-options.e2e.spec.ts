import { expect, test } from '@playwright/test';

for (const formatter of [
  {
    path: '/json-prettify',
    title: 'JSON prettify and format - IT Tools',
    switchName: 'Sort keys',
    indentName: 'Indent size (0–10)',
  },
  {
    path: '/yaml-prettify',
    title: 'YAML prettify and format - IT Tools',
    switchName: 'Sort keys',
    indentName: 'Indent size (1–10)',
  },
] as const) {
  test(`${formatter.path} exposes the shared responsive option controls`, async ({ page }) => {
    await page.goto(formatter.path);
    await expect(page).toHaveTitle(formatter.title);
    await expect(page.getByRole('switch', { name: formatter.switchName })).toBeVisible();
    await expect(page.getByRole('spinbutton', { name: formatter.indentName })).toBeVisible();

    await page.setViewportSize({ width: 390, height: 844 });
    const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(hasHorizontalOverflow).toBe(false);
  });
}
