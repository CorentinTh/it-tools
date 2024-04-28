<script setup lang="ts">
import { generateTree } from './lib/generate-tree';
import { parseInput } from './lib/parse-input';
import { withDefaultOnError } from '@/utils/defaults';

const inputStructure = ref([
  'my-app',
  '  src',
  '    index.html',
  '    main.ts',
  '   main.scss',
  '  - build',
  '    - index.html',
  '    main.js',
  '    main.css',
  '',
  '  ',
  '  .prettierrc.json',
  '  .gitlab-ci.yml',
  '  README.md',
  'empty dir',
].join('\n'));
const outputTree = computed(() => withDefaultOnError(() => generateTree(parseInput(inputStructure.value)), ''));
</script>

<template>
  <div>
    <c-input-text
      v-model:value="inputStructure"
      label="Your indented structure"
      placeholder="Paste your indented structure here..."
      rows="20"
      multiline
      raw-text
      monospace
    />

    <n-divider />

    <n-form-item label="Your tree-like structure:">
      <TextareaCopyable :value="outputTree" />
    </n-form-item>
  </div>
</template>
