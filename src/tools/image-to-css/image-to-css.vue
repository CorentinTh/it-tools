<script setup lang="ts">
import type { Ref } from 'vue';
import { type CSSType, imageToCSS } from './image-to-css.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const typeOptions = [
  { label: 'Background', value: 'Background' },
  { label: 'Border', value: 'Border' },
  { label: 'ListItem Bullet', value: 'ListItemBullet' },
  { label: 'CSS Data Url', value: 'Url' },
];

const type = ref('Background');
const svgContent = ref('');
const fileInput = ref() as Ref<File | null>;
const cssCode = computedAsync(async () => {
  try {
    return (await imageToCSS(fileInput.value || svgContent.value, type.value as CSSType));
  }
  catch (e: any) {
    return e.toString();
  }
});

async function onUpload(file: File) {
  if (file) {
    fileInput.value = file;
  }
}

watch(svgContent, (_, newValue) => {
  if (newValue !== '') {
    fileInput.value = null;
  }
});
</script>

<template>
  <div>
    <c-file-upload
      title="Drag and drop an image here, or click to select a file"
      paste-image
      @file-upload="onUpload"
    />
    <n-p>OR</n-p>

    <c-input-text
      v-model:value="svgContent"
      label="SVG Content"
      placeholder="Paste your SVG content here"
      mb-2
    />

    <n-divider />

    <c-select
      v-model:value="type"
      label-position="top"
      label="CSS Type:"
      :options="typeOptions"
      placeholder="Select CSS Type"
    />

    <div v-if="cssCode !== ''">
      <n-divider />

      <h3>CSS Code</h3>
      <TextareaCopyable
        :value="cssCode"
        word-wrap
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
::v-deep(.n-upload-trigger) {
  width: 100%;
}
</style>
