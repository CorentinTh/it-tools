<script setup lang="ts">
import { Base64 } from 'js-base64';
import { Transform, decodeIco, decodeImage, encodeIcoImages, encodePng } from 'image-in-browser';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';

const status = ref<'idle' | 'done' | 'error' | 'processing'>('idle');
const file = ref<File | null>(null);

const base64OutputFile = ref('');
const fileName = ref('');
const fileExtension = ref('');
const { download } = useDownloadFileFromBase64(
  {
    source: base64OutputFile,
    filename: fileName,
    extension: fileExtension,
  });

async function onFileUploaded(uploadedFile: File) {
  file.value = uploadedFile;
  const fileBuffer = new Uint8Array(await uploadedFile.arrayBuffer());

  fileName.value = `${uploadedFile.name}`;
  status.value = 'processing';
  try {
    if (uploadedFile.type.includes('icon')) {
      const decodedIco = decodeIco({
        data: fileBuffer,
        largest: true,
      });
      if (decodedIco == null) {
        throw new Error('Invalid ICO file!');
      }
      const encodedPng = encodePng({
        image: decodedIco,
      });
      fileExtension.value = 'png';
      base64OutputFile.value = `data:image/png;base64,${Base64.fromUint8Array(encodedPng)}`;
    }
    else {
      const decodedImage = decodeImage({
        data: fileBuffer,
      });

      if (decodedImage == null) {
        throw new Error('Invalid PNG file!');
      };

      const encodedICO = encodeIcoImages({
        images: [16, 32, 64, 128, 256].map(size => Transform.copyResize({
          image: decodedImage,
          width: size,
          maintainAspect: true,
        })),
      });
      fileExtension.value = 'ico';
      base64OutputFile.value = `data:image/x-icon;base64,${Base64.fromUint8Array(encodedICO)}`;
    }
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
        <c-file-upload
          title="Drag and drop an ICO or PNG/JPEG file here, or click to select a file"
          accept=".ico,.png,.jpg"
          paste-image
          @file-upload="onFileUploaded"
        />
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
