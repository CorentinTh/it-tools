import { expect, test } from '@playwright/test';

const routes = [
  {
    path: '/eta-calculator',
    title: 'ETA calculator - IT Tools',
    numericNames: ['Total units', 'Units consumed', 'Time span'],
  },
  {
    path: '/base-converter',
    title: 'Integer base converter - IT Tools',
    numericNames: ['Input base (2–64)', 'Custom output base (2–64)'],
  },
  {
    path: '/roman-numeral-converter',
    title: 'Roman numeral converter - IT Tools',
    numericNames: ['Arabic number'],
  },
] as const;

for (const route of routes) {
  test(`${route.path} uses labelled responsive numeric fields`, async ({ page }) => {
    await page.goto(route.path);
    await expect(page).toHaveTitle(route.title);
    for (const name of route.numericNames) {
      await expect(page.getByRole('spinbutton', { name })).toBeVisible();
    }

    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
  });
}

test('Temperature converter exposes all scales as equal labelled numeric fields', async ({ page }) => {
  await page.goto('/temperature-converter');
  await expect(page).toHaveTitle('Temperature converter - IT Tools');

  for (const name of [
    'Kelvin (K)',
    'Celsius (°C)',
    'Fahrenheit (°F)',
    'Rankine (°R)',
    'Delisle (°De)',
    'Newton (°N)',
    'Réaumur (°Ré)',
    'Rømer (°Rø)',
  ]) {
    await expect(page.getByRole('spinbutton', { name })).toBeVisible();
  }

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});
