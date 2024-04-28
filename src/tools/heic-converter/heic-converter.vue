<script setup lang="ts">
import { Base64 } from 'js-base64';
import heicConvert from 'heic-convert/browser';
import { useDownloadFileFromBase64Refs } from '@/composable/downloadBase64';

const status = ref<'idle' | 'done' | 'error' | 'processing'>('idle');
const file = ref<File | null>(null);

const base64OutputImage = ref('');
const fileName = ref('');
const format = ref('jpg');
const formats = [
  { value: 'jpg', label: 'JPEG' },
  { value: 'png', label: 'PNG' },
];
const { download } = useDownloadFileFromBase64Refs(
  {
    source: base64OutputImage,
    filename: fileName,
  });

async function onFileUploaded(uploadedFile: File) {
  file.value = uploadedFile;
  const fileBuffer = await uploadedFile.arrayBuffer();

  fileName.value = `${uploadedFile.name}.${format.value}`;
  status.value = 'processing';
  try {
    let convertFormat;
    if (format.value === 'jpg') {
      convertFormat = 'JPEG';
    }
    else if (format.value === 'png') {
      convertFormat = 'PNG';
    }
    else {
      throw new Error('unknown format');
    }

    const outputBuffer = await heicConvert({
      buffer: new Uint8Array(fileBuffer),
      format: convertFormat as ('JPEG' | 'PNG'),
      quality: 0.98,
    });
    base64OutputImage.value = `data:image/${convertFormat.toLowerCase()};base64,${Base64.fromUint8Array(new Uint8Array(outputBuffer))}`;

    status.value = 'done';

    download();
  }
  catch (e) {
    status.value = 'error';
  }
}
</script>

<template>
  <div>
    <c-select
      v-model:value="format"
      :options="formats"
      label="Output format"
    />

    <div style="flex: 0 0 100%" mt-3>
      <div mx-auto max-w-600px>
        <c-file-upload
          title="Drag and drop a HEIC file here, or click to select a file"
          accept=".heic,.heif" @file-upload="onFileUploaded"
        />
      </div>
    </div>
    <div mt-3 flex justify-center>
      <img :src="base64OutputImage" max-w-300px>
    </div>

    <div mt-3 flex justify-center>
      <c-alert v-if="status === 'error'" type="error">
        An error occured processing {{ fileName }}. HEIC/HEIF is invalid.
      </c-alert>
      <n-spin
        v-if="status === 'processing'"
        size="small"
      />
    </div>
  </div>
</template>
