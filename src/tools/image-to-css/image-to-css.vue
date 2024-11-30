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

const inputType = ref<'file' | 'content'>('file');
const type = ref('Background');
const svgContent = ref('');
const fileInput = ref() as Ref<File | null>;
const cssCode = computedAsync(async () => {
  try {
    if (inputType.value === 'file' && fileInput.value) {
      return (await imageToCSS(fileInput.value, type.value as CSSType));
    }
    else {
      return (await imageToCSS(svgContent.value, type.value as CSSType));
    }
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
    <n-radio-group v-model:value="inputType" name="radiogroup" mb-2 flex justify-center>
      <n-space>
        <n-radio
          value="file"
          label="File"
        />
        <n-radio
          value="content"
          label="Content"
        />
      </n-space>
    </n-radio-group>

    <c-file-upload
      v-if="inputType === 'file'"
      title="Drag and drop an image here, or click to select a file"
      paste-image
      @file-upload="onUpload"
    />

    <c-input-text
      v-if="inputType === 'content'"
      v-model:value="svgContent"
      multiline
      rows="5"
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
