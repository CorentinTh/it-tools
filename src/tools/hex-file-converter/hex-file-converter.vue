<script setup lang="ts">
import { Buffer } from 'node:buffer';
import type { Ref } from 'vue';
import { useCopy } from '@/composable/copy';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';

const fileName = ref('');
const fileExtension = ref('');
const hexInput = ref('');
const base64Input = computed(() => {
  const hexString = hexInput.value?.replace(/[^\da-f]/gi, '');
  try {
    return `data:application/octet-stream;base64,${Buffer.from(hexString, 'hex').toString('base64')}`;
  }
  catch {
    return '';
  }
});
const { download } = useDownloadFileFromBase64(
  {
    source: base64Input,
    filename: fileName,
    extension: fileExtension,
  });

function downloadFile() {
  try {
    download();
  }
  catch (_) {
    //
  }
}

function buf2hex(buffer: ArrayBuffer, separator: string): string {
  return [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join(separator);
}

async function ReadFileAsHex(file: File, separator: string = ' '): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(buf2hex(reader.result as ArrayBuffer, separator));
    };
    reader.onerror = () => reject(reader.error?.toString());
    reader.readAsArrayBuffer(file);
  });
}

const separator = useStorage('hex-converter:sep', ' ');
const fileInput = ref() as Ref<File>;
const fileHex = computedAsync(async () => {
  const file = fileInput.value;
  const sep = separator.value;

  return await ReadFileAsHex(file, sep);
});
const { copy: copyFileHex } = useCopy({ source: fileHex, text: 'Hex string copied to the clipboard' });

function onUpload(file: File) {
  if (file) {
    fileInput.value = file;
  }
}
</script>

<template>
  <c-card title="HEX to file">
    <n-grid cols="3" x-gap="12">
      <n-gi span="2">
        <c-input-text
          v-model:value="fileName"
          label="File Name"
          placeholder="Download filename"
          mb-2
        />
      </n-gi>
      <n-gi>
        <c-input-text
          v-model:value="fileExtension"
          label="Extension"
          placeholder="Extension"
        />
      </n-gi>
    </n-grid>

    <n-form-item label="Content in Hex">
      <c-input-text
        v-model:value="hexInput"
        multiline
        placeholder="Put your Hex file string here..."
        rows="5"
      />
    </n-form-item>

    <n-divider />

    <div flex justify-center>
      <c-button :disabled="hexInput === ''" @click="downloadFile()">
        Download file
      </c-button>
    </div>
  </c-card>

  <c-card title="File to HEX">
    <c-file-upload
      title="Drag and drop a file here, or click to select a file"
      mb-2
      @file-upload="onUpload"
    />

    <c-input-text
      v-model:value="separator"
      label="Separator"
      label-position="left"
      placeholder="Separator"
      mb-2
    />

    <n-divider />

    <n-form-item label="File in Hex">
      <c-input-text
        :value="fileHex"
        multiline readonly
        placeholder="File in hex will be here"
        rows="5" mb-2
      />
    </n-form-item>

    <div flex justify-center>
      <c-button @click="copyFileHex()">
        Copy
      </c-button>
    </div>
  </c-card>
</template>

<style lang="less" scoped>
::v-deep(.n-upload-trigger) {
  width: 100%;
}
</style>
