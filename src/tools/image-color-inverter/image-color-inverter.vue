<script setup lang="ts">
import { invertImageFile } from './image-color-inverter.service';
import { useCopy } from '@/composable/copy';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { withDefaultOnError } from '@/utils/defaults';

const originalImageSrc = ref<string>('');
const invertedImageSrc = ref<string>('');
const isProcessing = ref(false);
const error = ref<string | null>(null);

const { copy: copyInvertedImage } = useCopy({
  source: invertedImageSrc,
  text: 'Inverted image base64 copied to clipboard',
});

const { download: downloadInvertedImage } = useDownloadFileFromBase64({
  source: invertedImageSrc,
  filename: 'inverted-image',
  extension: 'png',
});

function handleFileUpload(file: File) {
  if (!file) {
    return;
  }

  error.value = null;
  isProcessing.value = true;

  // Show original image
  const reader = new FileReader();
  reader.onload = (e) => {
    originalImageSrc.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);

  // Process the image
  invertImageFile(file)
    .then((result) => {
      invertedImageSrc.value = result;
    })
    .catch((err) => {
      error.value = withDefaultOnError(err, 'Failed to process image');
    })
    .finally(() => {
      isProcessing.value = false;
    });
}

function clearImages() {
  originalImageSrc.value = '';
  invertedImageSrc.value = '';
  error.value = null;
}
</script>

<template>
  <c-card>
    <c-file-upload
      title="Drag and drop an image here, or click to select"
      accept="image/*"
      @file-upload="handleFileUpload"
    />

    <n-spin :show="isProcessing" style="width: 100%">
      <n-alert v-if="error" style="margin-top: 16px" type="error" :show-icon="false">
        {{ error }}
      </n-alert>

      <n-divider v-if="originalImageSrc || invertedImageSrc" />

      <n-grid v-if="originalImageSrc || invertedImageSrc" :cols="2" :x-gap="16">
        <n-gi v-if="originalImageSrc">
          <div>
            <n-h3>Original Image</n-h3>
            <div class="image-container">
              <img :src="originalImageSrc" alt="Original">
            </div>
          </div>
        </n-gi>

        <n-gi v-if="invertedImageSrc">
          <div>
            <n-h3>Inverted Image</n-h3>
            <div class="image-container">
              <img :src="invertedImageSrc" alt="Inverted">
            </div>
            <n-space style="margin-top: 12px" justify="start">
              <c-button @click="downloadInvertedImage()">
                Download PNG
              </c-button>
              <c-button @click="copyInvertedImage()">
                Copy Base64
              </c-button>
            </n-space>
          </div>
        </n-gi>
      </n-grid>

      <div v-if="originalImageSrc || invertedImageSrc" style="margin-top: 16px; text-align: center">
        <c-button secondary @click="clearImages()">
          Clear & Upload New
        </c-button>
      </div>
    </n-spin>
  </c-card>
</template>

<style lang="less" scoped>
.image-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--n-color-embedded);
  overflow: hidden;

  img {
    max-width: 100%;
    max-height: 400px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}
</style>
