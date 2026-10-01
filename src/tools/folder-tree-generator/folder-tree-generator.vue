<script setup lang="ts">
import { buildTree, renderTree } from './folder-tree-generator.models';
import { withDefaultOnError } from '@/utils/defaults';
import { useCopy } from '@/composable/copy';

const input = ref(`src
  main.ts
  tools
    csv-to-json
      index.ts
package.json
README.md`);

const tree = computed(() => withDefaultOnError(() => renderTree(buildTree(input.value)), ''));
const { copy } = useCopy({ source: tree, text: 'Folder tree copied to the clipboard' });
</script>

<template>
  <c-card>
    <n-grid cols="2" x-gap="12">
      <n-gi>
        <c-input-text
          v-model:value="input"
          label="Indented structure"
          placeholder="Paste an indented file/folder listing (tabs or spaces)..."

          rows="18"
          raw-text autosize multiline
        />
      </n-gi>
      <n-gi>
        <c-input-text
          :value="tree"
          label="Folder tree"
          placeholder="The tree output will be here..."
          multiline
          raw-text
          rows="18"
          autosize
          readonly
          monospace
        />
      </n-gi>
    </n-grid>

    <div mt-3 flex justify-center>
      <c-button :disabled="!tree" @click="copy()">
        Copy tree to clipboard
      </c-button>
    </div>
  </c-card>
</template>
