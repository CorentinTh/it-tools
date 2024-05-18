<script setup lang="ts">
import { BarcodeFormat, BrowserMultiFormatReader } from '@zxing/library';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const imageBase64 = ref('');
const barCode = computedAsync(async () => {
  if (imageBase64.value === '') {
    return { text: '', format: '', error: '' };
  }
  try {
    const barcodeReader = new BrowserMultiFormatReader();
    const result = (await barcodeReader.decodeFromImageUrl(imageBase64.value));
    return { text: result.getText(), format: BarcodeFormat[result.getBarcodeFormat()], error: '' };
  }
  catch (e: any) {
    return { error: e.toString(), text: '', format: '' };
  }
});

function blobToBase64(blob: Blob) {
  if (blob === null) {
    return Promise.resolve('');
  }
  return new Promise<string>((resolve, _reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

async function onUpload(file: File) {
  if (file) {
    imageBase64.value = await blobToBase64(file);
  }
}
</script>

<template>
  <div>
    <c-file-upload
      title="Drag and drop a BarCode here, or click to select a file"
      :paste-image="true"
      mb-3
      @file-upload="onUpload"
    />

    <div v-if="barCode?.text">
      <n-divider />

      <h3>Decoded <span v-if="barCode?.format">({{ barCode?.format }})</span></h3>
      <TextareaCopyable
        :value="barCode?.text"
        :word-wrap="true"
      />
    </div>
    <c-alert v-if="barCode?.error">
      {{ barCode?.error }}
    </c-alert>
  </div>
</template>

<style lang="less" scoped>
::v-deep(.n-upload-trigger) {
  width: 100%;
}
</style>
