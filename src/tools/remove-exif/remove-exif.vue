<script setup lang="ts">
import { Buffer } from 'node:buffer';
import { Base64 } from 'js-base64';
import ExifTransformer from 'exif-be-gone';
import MemoryStream from 'memorystream';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';

const status = ref<'idle' | 'done' | 'error' | 'processing'>('idle');
const file = ref<File | null>(null);

interface ToBufferMemoryStream extends MemoryStream {
  toBuffer(): Buffer
}

const base64OutputFile = ref('');
const fileName = ref('');
const { download } = useDownloadFileFromBase64(
  {
    source: base64OutputFile,
    filename: fileName,
    extension: 'jpg',
  });

async function onFileUploaded(uploadedFile: File) {
  file.value = uploadedFile;
  const fileBuffer = await uploadedFile.arrayBuffer();

  fileName.value = `noexif_${uploadedFile.name}`;
  status.value = 'processing';
  try {
    const inStream = MemoryStream.createReadStream(Buffer.from(fileBuffer));
    const outStream = MemoryStream.createWriteStream();
    const trans = new ExifTransformer();
    await new Promise((resolve, _reject) => {
      inStream.pipe(trans).pipe(outStream).on('finish', () => resolve(true));
    });

    const outFileBuffer = (outStream as ToBufferMemoryStream).toBuffer();
    base64OutputFile.value = `data:image/File;base64,${Base64.fromUint8Array(outFileBuffer)}`;
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
    <div style="flex: 0 0 100%">
      <div mx-auto max-w-600px>
        <c-file-upload title="Drag and drop a Image file here, or click to select a file" accept="image/*" @file-upload="onFileUploaded" />
      </div>
    </div>

    <div mt-3 flex justify-center>
      <c-alert v-if="status === 'error'" type="error">
        An error occured processing {{ fileName }}
      </c-alert>
      <n-spin
        v-if="status === 'processing'"
        size="small"
      />
    </div>
  </div>
</template>
