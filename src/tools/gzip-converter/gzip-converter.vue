<script setup lang="ts">
import { GZIP_MAX_FILE_BYTES, blobToUtf8, decodeGzipBase64, encodeGzipBase64, gzipStreamsAvailable, textToBoundedBlob, transformGzip } from './gzip-converter.service';
import { formatBytes } from '@/utils/convert';
import { useCopy } from '@/composable/copy';
import { downloadBlobFile } from '@/utils/standalone-host';

type Mode = 'compress-text' | 'decompress-base64' | 'compress-file' | 'decompress-file';
const mode = ref<Mode>('compress-text');
const textInput = ref('Hello from IT Tools!');
const selectedFile = shallowRef<File>();
const textOutput = ref('');
const base64Output = ref('');
const resultBlob = shallowRef<Blob>();
const resultName = ref('');
const status = ref('Ready.');
const error = ref('');
const running = ref(false);
const completedSignature = ref('');
const signature = computed(() => `${mode.value}\0${textInput.value}\0${selectedFile.value?.name ?? ''}\0${selectedFile.value?.size ?? 0}\0${selectedFile.value?.lastModified ?? 0}`);
const stale = computed(() => Boolean(resultBlob.value && signature.value !== completedSignature.value));
let controller: AbortController | undefined;
const { copy: copyBase64 } = useCopy({ source: base64Output, text: 'GZIP Base64 copied' });
const { copy: copyText } = useCopy({ source: textOutput, text: 'Decompressed text copied' });

function clearResult() {
  resultBlob.value = undefined;
  resultName.value = '';
  textOutput.value = '';
  base64Output.value = '';
  completedSignature.value = '';
}

function selectFile(file: File) {
  selectedFile.value = file;
  clearResult();
  error.value = file.size > GZIP_MAX_FILE_BYTES ? 'The selected file exceeds the 64 MiB limit.' : '';
  status.value = error.value || 'File selected. Choose Run GZIP task.';
}

function cancel() {
  controller?.abort();
}

function safeOutputName(file: File, decompress: boolean): string {
  const safe = file.name.replace(/[\\/]/gu, '_') || 'file';
  return decompress ? (safe.replace(/\.gz$/iu, '') || 'decompressed-file') : `${safe}.gz`;
}

async function run() {
  if (running.value || !gzipStreamsAvailable()) {
    return;
  }
  const operation = mode.value.startsWith('compress') ? 'compress' : 'decompress';
  const fileMode = mode.value.endsWith('file');
  if (fileMode && (!selectedFile.value || selectedFile.value.size > GZIP_MAX_FILE_BYTES)) {
    return;
  }
  controller = new AbortController();
  running.value = true;
  error.value = '';
  status.value = operation === 'compress' ? 'Compressing locally…' : 'Decompressing locally…';
  try {
    const input = fileMode
      ? selectedFile.value!
      : operation === 'compress'
        ? textToBoundedBlob(textInput.value)
        : new Blob([decodeGzipBase64(textInput.value)], { type: 'application/gzip' });
    const result = await transformGzip(input, operation, controller.signal);
    resultBlob.value = result.blob;
    if (fileMode) {
      resultName.value = safeOutputName(selectedFile.value!, operation === 'decompress');
    }
    else if (operation === 'compress') {
      base64Output.value = encodeGzipBase64(new Uint8Array(await result.blob.arrayBuffer()));
      resultName.value = 'text.txt.gz';
    }
    else {
      textOutput.value = await blobToUtf8(result.blob);
      resultName.value = 'decompressed.txt';
    }
    completedSignature.value = signature.value;
    status.value = `Completed locally: ${formatBytes(result.byteLength)} output.`;
  }
  catch (caught) {
    error.value = caught instanceof DOMException && caught.name === 'AbortError' ? 'The GZIP task was cancelled.' : caught instanceof Error ? caught.message : 'The GZIP task failed.';
    status.value = 'No new result was produced.';
  }
  finally {
    running.value = false;
    controller = undefined;
  }
}

async function download() {
  if (!resultBlob.value || !resultName.value) {
    return;
  }
  await downloadBlobFile(resultBlob.value, resultName.value);
}

watch(mode, () => {
  cancel();
  clearResult();
  error.value = '';
  status.value = 'Ready.';
});
onBeforeUnmount(() => {
  cancel();
  clearResult();
  selectedFile.value = undefined;
});
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Local streaming GZIP">
      Uses the browser Compression Streams API. Inputs are not uploaded or persisted. Input is limited to 64 MiB, output to 72 MiB, and text display to 1 MiB. A browser without native GZIP streams is reported as unsupported.
    </c-alert>
    <c-card class="c-task-options" title="Operation">
      <c-buttons-select
        v-model:value="mode" :options="[
          { label: 'Compress text', value: 'compress-text' },
          { label: 'Decompress Base64', value: 'decompress-base64' },
          { label: 'Compress file', value: 'compress-file' },
          { label: 'Decompress file', value: 'decompress-file' },
        ]"
      />
    </c-card>
    <c-alert v-if="!gzipStreamsAvailable()" title="GZIP streams unavailable">
      This browser does not expose CompressionStream and DecompressionStream.
    </c-alert>
    <c-card v-if="mode.endsWith('file')" title="Local file">
      <c-file-upload :accept="mode === 'decompress-file' ? '.gz,application/gzip,application/x-gzip' : undefined" data-test-id="gzip-file" title="Drop one local file here or click to select (maximum 64 MiB)" @file-upload="selectFile" />
      <p v-if="selectedFile" mt-3>
        <strong>Name:</strong> <bdi>{{ selectedFile.name }}</bdi> · <strong>Size:</strong> {{ formatBytes(selectedFile.size) }}
      </p>
    </c-card>
    <c-input-text v-else v-model:value="textInput" :label="mode === 'compress-text' ? 'UTF-8 text' : 'GZIP bytes as standard Base64'" :placeholder="mode === 'compress-text' ? 'Text to compress…' : 'H4sI…'" raw-text monospace multiline :rows="12" />
    <div class="c-task-actions">
      <c-button type="primary" :disabled="running || !gzipStreamsAvailable() || (mode.endsWith('file') && !selectedFile)" data-test-id="gzip-run" @click="run">
        {{ running ? 'Working…' : 'Run GZIP task' }}
      </c-button>
      <c-button v-if="running" @click="cancel">
        Cancel
      </c-button>
    </div>
    <p class="c-task-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="error" title="GZIP task error" data-test-id="gzip-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="stale" title="Result uses previous input">
      Run the task again before using this result.
    </c-alert>
    <c-input-text v-if="base64Output" :value="base64Output" label="Compressed GZIP Base64" data-test-id="gzip-base64-output" raw-text monospace multiline readonly :rows="12" />
    <c-input-text v-if="textOutput" :value="textOutput" label="Decompressed UTF-8 text" data-test-id="gzip-text-output" raw-text monospace readonly multiline :rows="12" />
    <div class="c-task-actions">
      <c-button v-if="base64Output" @click="copyBase64()">
        Copy Base64
      </c-button>
      <c-button v-if="textOutput" @click="copyText()">
        Copy text
      </c-button>
      <c-button :disabled="!resultBlob || stale" data-test-id="gzip-download" @click="download">
        Download {{ resultName || 'result' }}
      </c-button>
    </div>
  </div>
</template>
