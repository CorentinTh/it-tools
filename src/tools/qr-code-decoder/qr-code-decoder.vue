<script setup lang="ts">
import type { Ref } from 'vue';
import qrcodeParser from 'qrcode-parser';
import { parseQRData } from './qr-code-decoder.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const fileInput = ref() as Ref<File>;
const qrCode = computedAsync(async () => {
  try {
    return (await qrcodeParser(fileInput.value));
  }
  catch (e: any) {
    return e.toString();
  }
});
const qrCodeParsed = computed(() => {
  try {
    const parsed = parseQRData(qrCode.value);
    return `Type: ${parsed.type}\nValue:${JSON.stringify(parsed.value, null, 2)}`;
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
</script>

<template>
  <div>
    <c-file-upload
      title="Drag and drop a QR Code here, or click to select a file"
      :paste-image="true"
      @file-upload="onUpload"
    />

    <n-divider />

    <div>
      <h3>Decoded</h3>
      <TextareaCopyable
        :value="qrCode"
        :word-wrap="true"
      />
    </div>
    <div>
      <h3>Parsed</h3>
      <TextareaCopyable
        :value="qrCodeParsed"
        :word-wrap="true"
      />
    </div>
  </div>
</template>

<style lang="less" scoped>
::v-deep(.n-upload-trigger) {
  width: 100%;
}
</style>
