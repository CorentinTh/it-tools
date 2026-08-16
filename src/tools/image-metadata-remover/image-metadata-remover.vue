<script setup lang="ts">
import type { ImageMetadataResult } from './image-metadata-remover.worker.protocol';
import { IMAGE_METADATA_MAX_FILE_BYTES, IMAGE_METADATA_MAX_FILE_LABEL } from './image-metadata-remover.worker.protocol';
import { ImageMetadataWorkerClient } from './image-metadata-remover.worker-client';
import { formatBytes } from '@/utils/convert';
import { downloadBlobFile } from '@/utils/standalone-host';

const selectedFile = shallowRef<File>();
const result = shallowRef<ImageMetadataResult>();
const resultBlob = shallowRef<Blob>();
const resultUrl = ref('');
const error = ref('');
const status = ref('Select one local image.');
const isRunning = ref(false);
const client = new ImageMetadataWorkerClient();
let operationId = 0;

const canRemove = computed(() => Boolean(selectedFile.value && !isRunning.value));
const downloadName = computed(() => {
  if (result.value?.mimeType === 'image/png') {
    return 'metadata-free.png';
  }
  if (result.value?.mimeType === 'image/webp') {
    return 'metadata-free.webp';
  }
  return 'metadata-free.jpg';
});

function clearResult() {
  if (resultUrl.value) {
    URL.revokeObjectURL(resultUrl.value);
  }
  resultUrl.value = '';
  result.value = undefined;
  resultBlob.value = undefined;
}

function selectFile(file: File) {
  operationId += 1;
  client.cancel('Image metadata removal was replaced by a new selection.');
  clearResult();
  selectedFile.value = file;
  error.value = '';
  status.value = file.size > 0 && file.size <= IMAGE_METADATA_MAX_FILE_BYTES
    ? 'Image selected. Choose Remove metadata.'
    : `Select an image between 1 byte and ${IMAGE_METADATA_MAX_FILE_LABEL}.`;
  isRunning.value = false;
}

async function removeMetadata() {
  const file = selectedFile.value;
  if (!file || !canRemove.value) {
    return;
  }
  const currentOperation = ++operationId;
  isRunning.value = true;
  error.value = '';
  status.value = 'Removing metadata in a local worker…';
  try {
    const completed = await client.run({ file });
    if (currentOperation !== operationId) {
      return;
    }
    clearResult();
    result.value = completed.value;
    resultBlob.value = new Blob([completed.value.output], { type: completed.value.mimeType });
    resultUrl.value = URL.createObjectURL(resultBlob.value);
    status.value = completed.value.removedBytes
      ? `Removed ${formatBytes(completed.value.removedBytes)} in ${completed.elapsedMs.toFixed(0)} ms.`
      : `No removable metadata containers were found (${completed.elapsedMs.toFixed(0)} ms).`;
  }
  catch (caught) {
    if (currentOperation === operationId) {
      error.value = caught instanceof Error ? caught.message : 'Image metadata removal failed.';
      status.value = 'Removal failed.';
    }
  }
  finally {
    if (currentOperation === operationId) {
      isRunning.value = false;
    }
  }
}

function cancel() {
  operationId += 1;
  client.cancel();
  isRunning.value = false;
  status.value = 'Removal cancelled.';
}

async function downloadResult() {
  if (!resultBlob.value) {
    return;
  }
  await downloadBlobFile(resultBlob.value, downloadName.value);
}

onBeforeUnmount(() => {
  operationId += 1;
  client.dispose();
  clearResult();
  selectedFile.value = undefined;
});
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Lossless local container cleanup">
      JPEG, PNG, and WebP files are parsed by signature in a disposable worker; encoded pixels are copied byte-for-byte, not decoded or recompressed. EXIF, XMP, IPTC/application comments, text/time, trailing data, and unknown non-rendering chunks are removed. ICC/color and animation chunks are preserved. This cannot prove that steganographic data or metadata embedded inside pixel/codec payloads is absent.
    </c-alert>
    <c-card title="Source image">
      <c-file-upload
        accept="image/jpeg,image/png,image/webp"
        data-test-id="metadata-image-upload"
        :disabled="isRunning"
        :title="`Drop one JPEG, PNG, or WebP image here, or choose a file (maximum ${IMAGE_METADATA_MAX_FILE_LABEL})`"
        @file-upload="selectFile"
      />
      <div v-if="selectedFile" mt-3 data-test-id="metadata-image-selection">
        <p><strong>Name:</strong> <bdi>{{ selectedFile.name }}</bdi></p>
        <p><strong>Browser type:</strong> {{ selectedFile.type || 'not provided' }} (signature is verified independently)</p>
        <p><strong>Size:</strong> {{ formatBytes(selectedFile.size) }}</p>
      </div>
    </c-card>
    <div class="c-task-actions">
      <c-button type="primary" :disabled="!canRemove" data-test-id="metadata-remove" @click="removeMetadata">
        {{ isRunning ? 'Removing…' : 'Remove metadata' }}
      </c-button>
      <c-button v-if="isRunning" @click="cancel">
        Cancel
      </c-button>
    </div>
    <p class="c-task-status" data-test-id="metadata-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="error" title="Metadata removal error" data-test-id="metadata-error">
      {{ error }}
    </c-alert>
    <c-card v-if="result && resultBlob && resultUrl" title="Metadata-free image" data-test-id="metadata-result">
      <div grid grid-cols-1 gap-4 md:grid-cols-2>
        <div>
          <p><strong>Verified format:</strong> {{ result.mimeType }}</p>
          <p><strong>Input:</strong> {{ formatBytes(result.inputBytes) }}</p>
          <p><strong>Output:</strong> {{ formatBytes(result.outputBytes) }}</p>
          <p><strong>Removed:</strong> {{ formatBytes(result.removedBytes) }}</p>
          <ul v-if="result.removedItems.length" mt-3 list-disc pl-5>
            <li v-for="item in result.removedItems" :key="item.type">
              {{ item.type }} × {{ item.count }} — {{ formatBytes(item.bytes) }}
            </li>
          </ul>
          <p v-else mt-3 op-70>
            No removable metadata containers were found. The output is still a separately verified copy.
          </p>
        </div>
        <div bg-checkerboard min-h-48 flex items-center justify-center overflow-hidden rounded>
          <img :src="resultUrl" alt="Metadata-free local preview" max-h-96 max-w-full>
        </div>
      </div>
      <div class="c-task-actions" mt-4>
        <c-button type="primary" data-test-id="metadata-download" @click="downloadResult">
          Download {{ downloadName }}
        </c-button>
      </div>
    </c-card>
  </div>
</template>
