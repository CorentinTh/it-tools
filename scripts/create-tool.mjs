import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdir, readFile, writeFile } from 'fs/promises';

const currentDirname = dirname(fileURLToPath(import.meta.url));

const toolsDir = join(currentDirname, '..', 'src', 'tools');
const toolName = process.argv[2];

if (!toolName) {
  throw new Error('Please specify a toolname.');
}

const toolNameCamelCase = toolName.replace(/-./g, (x) => x[1].toUpperCase());
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
  <n-card>
    Lorem ipsum
  </n-card>
</template>

<script setup lang="ts">

</script>

<style lang="less" scoped>
</style>
`
);

createToolFile(
  `index.ts`,
  `
import { ArrowsShuffle } from '@vicons/tabler';
import type { ITool } from './../Tool';

export const tool: ITool = {
  name: '${toolName}',
  path: '/${toolName}',
  description: '',
  keywords: ['${toolName.split('-').join("', '")}'],
  component: () => import('./${toolName}.vue'),
  icon: ArrowsShuffle,
};
`
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
`
);

const toolsIndex = join(toolsDir, 'index.ts');
const indexContent = await readFile(toolsIndex, { encoding: 'utf-8' }).then((r) => r.split('\n'));

indexContent.splice(3, 0, `import { tool as ${toolNameCamelCase} } from './${toolName}';`);
writeFile(toolsIndex, indexContent.join('\n'));
console.log(`Added import in: ${toolsIndex}`);
