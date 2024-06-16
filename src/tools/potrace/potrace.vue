<script setup lang="ts">
import type { Ref } from 'vue';
import potrace from 'potrace';
import Base64 from 'js-base64';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

async function traceAsync(input: Uint8Array) {
  return new Promise<string>((resolve, reject) => {
    potrace.trace(input, (err: Error, svg: string) => {
      if (err) {
        reject(err);
      }
      resolve(svg);
    });
  });
}

async function posterizeAsync(input: Uint8Array) {
  return new Promise<string>((resolve, reject) => {
    potrace.posterize(input, (err: Error, svg: string) => {
      if (err) {
        reject(err);
      }
      resolve(svg);
    });
  });
}

function file2Buffer(file: File) {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const buffer = reader.result as ArrayBuffer;
      resolve(buffer);
    });
    reader.readAsArrayBuffer(file);
  });
}

const posterize = ref(true);
const fileInput = ref() as Ref<File>;
const svg = computedAsync(async () => {
  const trace = !posterize.value;
  try {
    const buffer = new Uint8Array(await file2Buffer(fileInput.value));
    return (trace ? await traceAsync(buffer) : await posterizeAsync(buffer));
  }
  catch (e: any) {
    return e.toString();
  }
});

const svgBase64 = computed(() => `data:image/svg+xml;base64,${Base64.encode(svg.value)}`);

async function onUpload(file: File) {
  if (file) {
    fileInput.value = file;
  }
}
</script>

<template>
  <div>
    <c-file-upload
      title="Drag and drop an image here, or click to select a file"
      :paste-image="true"
      @file-upload="onUpload"
    />

    <n-checkbox v-model:checked="posterize">
      Posterize?
    </n-checkbox>

    <n-divider />

    <div>
      <h3>Potrace result</h3>
      <TextareaCopyable
        :value="svg"
        :word-wrap="true"
      />

      <n-divider />

      <img width="150" :src="svgBase64">
    </div>
  </div>
</template>

<style lang="less" scoped>
::v-deep(.n-upload-trigger) {
  width: 100%;
}
</style>
