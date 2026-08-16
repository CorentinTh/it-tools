import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import {
  TOOL_CATEGORY_NAMES,
  discoverToolDescriptors,
  generateToolRegistry,
} from './generate-tool-registry.mjs';

const currentDirname = dirname(fileURLToPath(import.meta.url));

const toolsDir = join(currentDirname, '..', 'src', 'tools');
// eslint-disable-next-line no-undef
const toolName = process.argv[2];
const toolCategory = process.argv[3];

if (!toolName) {
  throw new Error('Please specify a tool name.');
}
if (!TOOL_CATEGORY_NAMES.includes(toolCategory)) {
  throw new Error(`Please specify one category: ${TOOL_CATEGORY_NAMES.join(', ')}`);
}

const existingDescriptors = await discoverToolDescriptors(toolsDir);
const nextCategoryOrder = existingDescriptors
  .filter(({ category }) => category === toolCategory)
  .reduce((highest, { order }) => Math.max(highest, order), -1) + 1;

const toolNameTitleCase = toolName[0].toUpperCase() + toolName.slice(1).replace(/-/g, ' ');
const toolDir = join(toolsDir, toolName);

await mkdir(toolDir);
console.log(`Directory created: ${toolDir}`);

const createToolFile = async (name, content) => {
  const filePath = join(toolDir, name);
  await writeFile(filePath, content.trim());
  console.log(`File created: ${filePath}`);
};

createToolFile(
  `${toolName}.vue`,
  `
<template>
  <div>
    Lorem ipsum
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="less" scoped>
</style>
`,
);

createToolFile(
  `index.ts`,
  `
import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const registry = {
  category: '${toolCategory}',
  order: ${nextCategoryOrder},
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: '${toolNameTitleCase}',
  path: '/${toolName}',
  description: '',
  keywords: ['${toolName.split('-').join("', '")}'],
  component: () => import('./${toolName}.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('${new Date().toISOString().split('T')[0]}'),
});
`,
);

createToolFile(`${toolName}.service.ts`, ``);
createToolFile(
  `${toolName}.service.test.ts`,
  `
import { expect, describe, it } from 'vitest';
// import { } from './${toolName}.service';
//
// describe('${toolName}', () => {
//
// })
`,
);

createToolFile(
  `${toolName}.e2e.spec.ts`,
  `
import { test, expect } from '@playwright/test';

test.describe('Tool - ${toolNameTitleCase}', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/${toolName}');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('${toolNameTitleCase} - IT Tools');
  });

  test('', async ({ page }) => {

  });
});
  
`,
);

await generateToolRegistry();
console.log('Regenerated the typed tool registry.');
