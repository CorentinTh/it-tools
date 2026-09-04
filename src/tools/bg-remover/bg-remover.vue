<script setup lang="ts">
import { removeBackground } from './bg-remover.service';

const originalImageUrl = ref('');
const resultImageUrl = ref('');
const fileName = ref('image');

const status = ref<'idle' | 'loading-model' | 'processing' | 'done' | 'error'>('idle');
const modelLoadProgress = ref(0);
const errorMessage = ref('');

async function onFileUpload(file: File) {
  status.value = 'loading-model';
  modelLoadProgress.value = 0;
  errorMessage.value = '';
  resultImageUrl.value = '';
  fileName.value = file.name.replace(/\.[^/.]+$/, '') || 'image';

  if (originalImageUrl.value) {
    URL.revokeObjectURL(originalImageUrl.value);
  }
  originalImageUrl.value = URL.createObjectURL(file);

  try {
    const resultBlob = await removeBackground({
      file,
      onProgress: ({ progress }) => {
        modelLoadProgress.value = progress;
        if (progress >= 100) {
          status.value = 'processing';
        }
      },
    });

    resultImageUrl.value = URL.createObjectURL(resultBlob);
    status.value = 'done';
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Something went wrong while removing the background.';
    status.value = 'error';
  }
}

function downloadResult() {
  if (!resultImageUrl.value) {
    return;
  }

  const link = document.createElement('a');
  link.href = resultImageUrl.value;
  link.download = `${fileName.value}-no-bg.png`;
  link.click();
}

function reset() {
  status.value = 'idle';
  originalImageUrl.value = '';
  resultImageUrl.value = '';
  errorMessage.value = '';
}
</script>

<template>
  <c-card m-auto max-w-800px>
    <c-file-upload
      v-if="status === 'idle'"
      title="Drag and drop an image here, or click to select a file"
      accept="image/*"
      @file-upload="onFileUpload"
    />

    <div v-else flex flex-col items-center gap-4>
      <div flex flex-wrap justify-center gap-6>
        <div flex flex-col items-center gap-2>
          <span text-sm op-70>Original</span>
          <n-image :src="originalImageUrl" width="280" object-fit="contain" />
        </div>

        <div v-if="status === 'done'" flex flex-col items-center gap-2>
          <span text-sm op-70>Background removed</span>
          <n-image :src="resultImageUrl" width="280" object-fit="contain" class="checkered-background" />
        </div>
      </div>

      <div v-if="status === 'loading-model' || status === 'processing'" max-w-350px w-full flex flex-col items-center gap-2>
        <n-spin size="small" />
        <span text-sm op-70>
          {{ status === 'loading-model' ? 'Downloading AI model (first use only)...' : 'Removing background...' }}
        </span>
        <n-progress
          v-if="status === 'loading-model'"
          type="line"
          :percentage="Math.round(modelLoadProgress)"
          :show-indicator="true"
        />
      </div>

      <c-alert v-if="status === 'error'" type="error" title="Could not remove the background">
        {{ errorMessage }}
      </c-alert>

      <div flex gap-3>
        <c-button v-if="status === 'done'" type="primary" @click="downloadResult">
          Download image
        </c-button>
        <c-button @click="reset">
          Choose another image
        </c-button>
      </div>
    </div>
  </c-card>
</template>

<style lang="less" scoped>
.checkered-background {
  background-image:
    linear-gradient(45deg, #80808033 25%, transparent 25%),
    linear-gradient(-45deg, #80808033 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #80808033 75%),
    linear-gradient(-45deg, transparent 75%, #80808033 75%);
  background-size: 16px 16px;
  background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
}
</style>
