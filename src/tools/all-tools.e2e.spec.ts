import { expect, test } from '@playwright/test';
import _ from 'lodash';
import { toolsByCategory } from './index';

for (const tool of _.flatten(toolsByCategory.map(category => category.components))) {
  test.describe(`Tool - ${tool.name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(tool.path);
    });

    test('Loads correctly (has correct title)', async ({ page }) => {
      await expect(page).toHaveTitle(`${tool.name} - IT Tools`);
    });
  });
}
