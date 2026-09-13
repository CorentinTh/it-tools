import { expect, test } from '@playwright/test';

test.describe('Sider scrollbar', () => {
  test('scrollbar thumb can be dragged over menu entries', async ({ page }) => {
    await page.goto('/color-converter');

    const container = page.locator('.n-layout-sider .n-scrollbar-container');
    const rail = page.locator('.n-layout-sider .n-scrollbar-rail--vertical');

    await container.evaluate((element) => {
      element.scrollTop = 1500;
      element.dispatchEvent(new Event('scroll', { bubbles: true }));
    });

    const railBox = await rail.boundingBox();
    expect(railBox).not.toBeNull();
    await page.mouse.move(railBox!.x + railBox!.width / 2, railBox!.y + railBox!.height / 2);

    const thumb = page.locator('.n-layout-sider .n-scrollbar-rail__scrollbar');
    const thumbBox = await thumb.boundingBox();
    expect(thumbBox).not.toBeNull();

    const thumbCenter = {
      x: thumbBox!.x + thumbBox!.width / 2,
      y: thumbBox!.y + thumbBox!.height / 2,
    };
    await expect.poll(() => page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.className, thumbCenter)).toBe(
      'n-scrollbar-rail__scrollbar',
    );

    const initialScrollTop = await container.evaluate(element => element.scrollTop);
    await page.mouse.move(thumbCenter.x, thumbCenter.y);
    await page.mouse.down();
    await page.mouse.move(thumbCenter.x, thumbCenter.y + 150, { steps: 5 });
    await page.mouse.up();

    await expect.poll(() => container.evaluate(element => element.scrollTop)).toBeGreaterThan(initialScrollTop);
  });
});
