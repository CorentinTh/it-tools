<script setup lang="ts">
import { FAVICON_SIZES, generateFaviconZip } from './favicon-generator.service';

const uploadedFile = ref<File | null>(null);
const previewUrl = ref<string>('');
const isGenerating = ref(false);
const errorMessage = ref('');

function onUpload(file: File) {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
  uploadedFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
  errorMessage.value = '';
}

async function downloadFavicons() {
  if (!uploadedFile.value) {
    return;
  }
  isGenerating.value = true;
  errorMessage.value = '';
  try {
    const blob = await generateFaviconZip(uploadedFile.value);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'favicons.zip';
    a.click();
    URL.revokeObjectURL(url);
  }
  catch {
    errorMessage.value = 'Failed to generate favicons. Make sure the uploaded file is a valid image.';
  }
  finally {
    isGenerating.value = false;
  }
}

onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>

<template>
  <c-card title="Favicon generator">
    <p mb-4 op-70>
      Upload a square image (PNG, JPG, SVG, or WebP). All conversion happens in your browser — nothing is sent to a server.
    </p>

    <c-file-upload
      title="Drag and drop an image here, or click to select"
      accept="image/*"
      @file-upload="onUpload"
    />

    <div v-if="previewUrl" mt-6 flex flex-col items-center gap-4>
      <img
        :src="previewUrl"
        alt="Uploaded preview"
        style="max-width: 160px; max-height: 160px; border-radius: 8px; object-fit: contain;"
      >

      <div text-sm op-60 text-center>
        Generated files:
        <span v-for="entry in FAVICON_SIZES" :key="entry.filename">
          {{ entry.filename }} ({{ entry.size }}×{{ entry.size }}),
        </span>
        site.webmanifest
      </div>

      <c-button :disabled="isGenerating" @click="downloadFavicons">
        {{ isGenerating ? 'Generating…' : 'Download favicons.zip' }}
      </c-button>

      <n-alert v-if="errorMessage" type="error" mt-2 style="width: 100%;">
        {{ errorMessage }}
      </n-alert>
    </div>
  </c-card>
</template>
