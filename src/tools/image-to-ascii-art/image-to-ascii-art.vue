<script setup lang="ts">
import { ImageToAsciiArt } from 'image-to-ascii-art';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { languages, translateToLanguage } from '@/utils/ascii-lang-utils';

const inputBase64 = ref('');
const language = useStorage('image-to-ascii-art:language', 'raw');
const scale = ref(100);
const errored = ref(false);
const processing = ref(false);

function toBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString() ?? '');
    reader.onerror = error => reject(error);
  });
}

const languagesOptions = languages.map(lang => ({ value: lang.id, label: lang.name }));

const output = computedAsync(async () => {
  const inputBase64Value = inputBase64.value;
  if (!inputBase64Value) {
    return '';
  }
  const scaleValue = scale.value / 100.0;
  const languageValue = language.value;

  let outputValue = '';
  processing.value = true;
  try {
    errored.value = false;

    const imageToAsciiArt = new ImageToAsciiArt({
      config: {
        drawWidth: scaleValue,
        drawHeight: scaleValue * 0.4,
      },
    });
    outputValue = translateToLanguage(await imageToAsciiArt.convert(inputBase64Value), languageValue);
    imageToAsciiArt.destroy();
  }
  catch (e) {
    errored.value = true;
  }
  processing.value = false;

  return outputValue;
});

async function onFileUploaded(uploadedFile: File) {
  inputBase64.value = await toBase64(uploadedFile);
}
</script>

<template>
  <c-card style="max-width: 600px;">
    <div style="flex: 0 0 100%">
      <div mx-auto max-w-600px>
        <c-file-upload
          title="Drag and drop a Image file here, or click to select a file"
          paste-image
          @file-upload="onFileUploaded"
        />
      </div>
    </div>

    <n-form-item label="Output scale" label-placement="left" mt-2>
      <n-slider v-model:value="scale" :step="1" :min="1" :max="100" mr-2 />
      <n-input-number v-model:value="scale" size="small" :min="1" :max="100" />
    </n-form-item>

    <c-select v-model:value="language" :options="languagesOptions" searchable mt-3 />

    <n-divider />

    <div v-if="processing" flex items-center justify-center>
      <n-spin size="medium" />
      <span class="ml-2">Processing...</span>
    </div>

    <c-alert v-if="errored" mt-1 text-center type="error">
      Current settings resulted in error.
    </c-alert>

    <n-form-item v-if="!processing && !errored" label="Ascii Art text:">
      <TextareaCopyable
        :value="output"
        mb-1 mt-1
        copy-placement="outside"
      />
    </n-form-item>
  </c-card>
</template>

<style lang="less">
.n-code pre {
  font-size: 0.2em !important;
}
</style>
