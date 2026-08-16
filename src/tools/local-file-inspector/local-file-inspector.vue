<script setup lang="ts">
import { FileInspectorWorkerClient } from './local-file-inspector.worker-client';
import { FILE_INSPECTOR_MAX_FILE_BYTES, FILE_INSPECTOR_MAX_FILE_LABEL, type FileInspectorResult } from './local-file-inspector.worker.protocol';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';
import { formatBytes } from '@/utils/convert';

const client = new FileInspectorWorkerClient();
const selectedFile = shallowRef<File>();
const result = shallowRef<FileInspectorResult>();
const status = ref('Select a local file. Nothing is read until you choose Inspect file.');
const error = ref('');
const isRunning = ref(false);
const progress = reactive({ bytesProcessed: 0, totalBytes: 0 });
let taskId = 0;

const canInspect = computed(() => Boolean(selectedFile.value && selectedFile.value.size <= FILE_INSPECTOR_MAX_FILE_BYTES && !isRunning.value));
const progressPercent = computed(() => progress.totalBytes > 0 ? Math.floor(progress.bytesProcessed / progress.totalBytes * 100) : 0);
const resultJson = computed(() => result.value
  ? JSON.stringify({
    fileSize: result.value.fileSize,
    detectedType: result.value.detectedName,
    detectedMime: result.value.detectedMime,
    extensions: result.value.extensions,
    evidence: result.value.evidence,
    crc32: result.value.crc32,
    previewBytes: result.value.previewBytes,
  }, null, 2)
  : '');

function selectFile(file: File) {
  taskId += 1;
  client.cancel('File inspection was cancelled because a different file was selected.');
  selectedFile.value = file;
  result.value = undefined;
  error.value = '';
  progress.bytesProcessed = 0;
  progress.totalBytes = file.size;
  status.value = file.size <= FILE_INSPECTOR_MAX_FILE_BYTES
    ? 'File selected. Choose Inspect file to read it locally.'
    : `The selected file exceeds the ${FILE_INSPECTOR_MAX_FILE_LABEL} limit.`;
}

async function inspect() {
  const file = selectedFile.value;
  if (!file || !canInspect.value) {
    return;
  }
  const currentTask = ++taskId;
  isRunning.value = true;
  error.value = '';
  result.value = undefined;
  status.value = 'Inspecting locally in a dedicated worker…';
  try {
    const inspected = await client.run({ file }, (next) => {
      if (currentTask !== taskId) {
        return;
      }
      progress.bytesProcessed = next.bytesProcessed;
      progress.totalBytes = next.totalBytes;
    });
    if (currentTask !== taskId || file !== selectedFile.value) {
      return;
    }
    result.value = inspected.value;
    status.value = `Inspection completed in ${Math.round(inspected.elapsedMs)} ms.`;
  }
  catch (caught) {
    if (currentTask !== taskId) {
      return;
    }
    error.value = caught instanceof Error ? caught.message : 'File inspection failed.';
    status.value = 'Inspection failed.';
  }
  finally {
    if (currentTask === taskId) {
      isRunning.value = false;
    }
  }
}

function cancel() {
  if (!isRunning.value) {
    return;
  }
  taskId += 1;
  client.cancel();
  isRunning.value = false;
  status.value = 'File inspection was cancelled.';
}

const { copy } = useCopy({ createToast: true });
function downloadHex() {
  if (result.value) {
    downloadTextFile({ content: result.value.hexPreview, filename: 'file-hex-preview.txt' });
  }
}

onBeforeUnmount(() => {
  taskId += 1;
  selectedFile.value = undefined;
  result.value = undefined;
  client.dispose();
});
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Local, bounded, and signature-first">
      File bytes are never uploaded or persisted. Detection uses magic bytes rather than trusting the filename or browser MIME. CRC-32 scans at most {{ FILE_INSPECTOR_MAX_FILE_LABEL }} in 4 MiB worker windows; the hex view is limited to the first 4 KiB.
    </c-alert>
    <c-card title="Local file">
      <c-file-upload
        data-test-id="file-inspector-upload"
        :title="`Drop one file here, or select a file (maximum ${FILE_INSPECTOR_MAX_FILE_LABEL})`"
        @file-upload="selectFile"
      />
      <div v-if="selectedFile" mt-3 data-test-id="file-inspector-selection">
        <p><span font-600>Name:</span> <bdi>{{ selectedFile.name }}</bdi></p>
        <p><span font-600>Size:</span> {{ formatBytes(selectedFile.size) }}</p>
        <p><span font-600>Browser-declared MIME:</span> {{ selectedFile.type || 'not provided' }}</p>
      </div>
    </c-card>
    <div class="c-task-actions">
      <c-button type="primary" :disabled="!canInspect" data-test-id="file-inspector-run" @click="inspect">
        {{ isRunning ? 'Inspecting…' : 'Inspect file' }}
      </c-button>
      <c-button v-if="isRunning" type="warning" @click="cancel">
        Cancel
      </c-button>
    </div>
    <p class="c-task-status" data-test-id="file-inspector-status" role="status" aria-live="polite">
      {{ status }}<span v-if="isRunning"> {{ progressPercent }}%</span>
    </p>
    <c-alert v-if="error" title="Inspection error" data-test-id="file-inspector-error">
      {{ error }}
    </c-alert>

    <c-card v-if="result" title="Detected metadata" data-test-id="file-inspector-result">
      <p><span font-600>Detected type:</span> {{ result.detectedName }}</p>
      <p><span font-600>Detected MIME:</span> {{ result.detectedMime }}</p>
      <p><span font-600>Likely extensions:</span> {{ result.extensions.join(', ') || 'unknown' }}</p>
      <p><span font-600>Signature evidence:</span> {{ result.evidence }}</p>
      <p><span font-600>CRC-32:</span> <code>{{ result.crc32 }}</code></p>
      <div class="c-task-actions" mt-3>
        <c-button @click="copy(result.crc32, { notificationMessage: 'CRC-32 copied to the clipboard' })">
          Copy CRC-32
        </c-button>
        <c-button @click="copy(resultJson, { notificationMessage: 'File metadata copied to the clipboard' })">
          Copy metadata JSON
        </c-button>
      </div>
    </c-card>

    <c-input-text
      :value="result?.hexPreview ?? ''"
      label="Hex preview (first 4 KiB)"
      placeholder="The bounded hex preview will appear here"
      test-id="file-inspector-hex"
      raw-text readonly monospace multiline
      :rows="18"
    />
    <div class="c-task-actions">
      <c-button :disabled="!result" @click="copy(result?.hexPreview ?? '', { notificationMessage: 'Hex preview copied to the clipboard' })">
        Copy hex
      </c-button>
      <c-button :disabled="!result" @click="downloadHex">
        Download preview
      </c-button>
    </div>
  </div>
</template>
