<script setup lang="ts">
import type { Ref } from 'vue';
import { pipeline } from '@huggingface/transformers';
import VueMathjax from 'vue-mathjax-next';
import { useScriptTag } from '@vueuse/core';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

useScriptTag('https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML');

const ocrInProgress = ref(false);
const fileInput = ref() as Ref<File>;
const latexResult = computedAsync(async () => {
  try {
    return (await ocr(fileInput.value));
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

function toBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString() ?? '');
    reader.onerror = error => reject(error);
  });
}

type TexifyResult = Array<{ generated_text: string }>;

async function ocr(file: File) {
  if (!file) {
    return '';
  }
  ocrInProgress.value = true;

  const imgBase64 = await toBase64(file);

  const pipe = await pipeline('image-to-text', 'Xenova/texify');
  const out: TexifyResult = (await pipe(imgBase64, { max_new_tokens: 384 })) as TexifyResult;

  ocrInProgress.value = false;
  return out.map(t => t.generated_text).join('\n');
};
</script>

<template>
  <div style="max-width: 600px;">
    <c-alert type="warning" mb-2>
      NB: processing is done in your browser, so be patient, processing can take a while
      <br>
      This tool required internet connection (to access models)
    </c-alert>

    <c-file-upload
      title="Drag and drop a Image here, or click to select a file"
      paste-image
      @file-upload="onUpload"
    />

    <n-divider />

    <div>
      <h3>Latex Result</h3>
      <TextareaCopyable
        v-if="!ocrInProgress"
        v-model:value="latexResult"
        :word-wrap="true" mb-2
      />

      <div style="text-align: center">
        <VueMathjax
          v-if="!ocrInProgress"
          :formula="latexResult"
        />
      </div>

      <n-spin
        v-if="ocrInProgress"
        size="small"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
::v-deep(.n-upload-trigger) {
  width: 100%;
}
</style>
