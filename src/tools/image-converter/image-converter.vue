<script setup lang="ts">
import { Base64 } from 'js-base64';
import type { MemoryImage } from 'image-in-browser';
import { decodeImage, encodeBmp, encodeGif, encodeIco, encodeJpg, encodePng, encodePvr, encodeTga, encodeTiff } from 'image-in-browser';
import { arrayBufferToWebP } from 'webp-converter-browser';
import { createSvg2png, initialize } from 'svg2png-wasm';
import { normal as robotoBase64 } from 'roboto-base64';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { useQueryParamOrStorage } from '@/composable/queryParams';

function readAsText(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => resolve(reader.result?.toString() ?? '');
    reader.onerror = error => reject(error);
  });
}

const status = ref<'idle' | 'done' | 'error' | 'processing'>('idle');
const file = ref<File | null>(null);

const svgScale = ref(2);
const base64OutputFile = ref('');
const fileName = ref('');
const fileExtension = ref('');
const { download } = useDownloadFileFromBase64(
  {
    source: base64OutputFile,
    filename: fileName,
    extension: fileExtension,
  });

const outputQuality = useQueryParamOrStorage({ name: 'qual', storageName: 'imgconv:q', defaultValue: 0.95 });
const outputFormats = {
  png: {
    mime: 'image/png',
    save: (image: MemoryImage) => encodePng({ image }),
  },
  jpg: {
    mime: 'image/jpeg',
    save: (image: MemoryImage) => encodeJpg({ image, quality: outputQuality.value }),
  },
  bmp: {
    mime: 'image/bmp',
    save: (image: MemoryImage) => encodeBmp({ image }),
  },
  gif: {
    mime: 'image/gif',
    save: (image: MemoryImage) => encodeGif({ image }),
  },
  ico: {
    mime: 'image/x-icon',
    save: (image: MemoryImage) => encodeIco({ image }),
  },
  tga: {
    mime: 'image/tga',
    save: (image: MemoryImage) => encodeTga({ image }),
  },
  pvr: {
    mime: 'image/pvr',
    save: (image: MemoryImage) => encodePvr({ image }),
  },
  tif: {
    mime: 'image/tif',
    save: (image: MemoryImage) => encodeTiff({ image }),
  },
  webp: {
    mime: 'image/webp',
    save: () => null,
  },
};

const outputFormat = useQueryParamOrStorage({ name: 'fmt', storageName: 'imgconv:fmt', defaultValue: 'png' });
const outputFormatHasQuality = computed(() => {
  return outputFormat.value === 'jpg';
});

const svgWasmLoaded = ref(false);

async function onFilesUploaded(uploadedFiles: File[]) {
  for (const file of uploadedFiles) {
    await onFileUploaded(file);
  }
}
async function onFileUploaded(uploadedFile: File) {
  const outputFormatValue = outputFormat.value;
  file.value = uploadedFile;
  let fileBuffer = new Uint8Array(await uploadedFile.arrayBuffer());

  fileName.value = uploadedFile.name.replace(/\.\w+$/, '');
  status.value = 'processing';
  try {
    if (outputFormatValue === 'webp') {
      const encodedImage = await arrayBufferToWebP(fileBuffer);
      fileExtension.value = 'webp';
      base64OutputFile.value = `data:image/webp;base64,${Base64.fromUint8Array(new Uint8Array(await encodedImage.arrayBuffer()))}`;
    }
    else {
      if (uploadedFile.type === 'image/svg+xml') {
        if (!svgWasmLoaded.value) {
          await initialize(fetch('/svg2png_wasm_bg.wasm'));
          svgWasmLoaded.value = true;
        }
        const svg2png = createSvg2png({
          fonts: [Base64.toUint8Array(robotoBase64)],
        });
        fileBuffer = await svg2png(await readAsText(uploadedFile), { scale: svgScale.value });
        svg2png.dispose();
      }
      const decodedImage = decodeImage({
        data: fileBuffer,
      });

      if (decodedImage == null) {
        throw new Error('Invalid Image file!');
      };

      const outConfig = outputFormats[outputFormatValue as (keyof typeof outputFormats)];
      const encodedImage = outConfig.save(decodedImage);
      fileExtension.value = outputFormatValue;
      base64OutputFile.value = `data:${outConfig.mime};base64,${Base64.fromUint8Array(encodedImage!)}`;
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
    <h4>First, select output options:</h4>

    <c-select
      v-model:value="outputFormat"
      label="Output format:"
      label-position="left"
      :options="Object.keys(outputFormats)"
      placeholder="Select output format"
      mb-2
    />

    <div mb-2 flex justify-center>
      <n-form-item v-if="outputFormatHasQuality" label="Output quality:" label-placement="left">
        <n-input-number v-model:value="outputQuality" :max="100" :min="0" w-full />
      </n-form-item>
      <n-form-item label="SVG scaling:" label-placement="left">
        <n-input-number v-model:value="svgScale" :min="0" />
      </n-form-item>
    </div>

    <h4>Then, drag and drop your images below and they will be converted and downloaded immediately:</h4>

    <div style="flex: 0 0 100%" mb-2>
      <div mx-auto max-w-600px>
        <c-file-upload
          title="Drag and drop images files here, or click to select some files"
          accept="image/*"
          paste-image
          multiple
          @file-upload="onFileUploaded"
          @files-upload="onFilesUploaded"
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
