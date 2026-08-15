<script setup lang="ts">
import { sanitizeFileNameForDisplay } from './file-hash.models';
import { FileHashWorkerClient } from './file-hash.worker-client';
import {
  FILE_HASH_ALGORITHMS,
  FILE_HASH_LEGACY_ALGORITHMS,
  FILE_HASH_MAX_FILE_BYTES,
  FILE_HASH_MAX_FILE_LABEL,
  type FileHashAlgorithm,
  type FileHashResult,
  toFileHashTaskError,
} from './file-hash.worker.protocol';
import { useCopy } from '@/composable/copy';
import { formatBytes } from '@/utils/convert';

type HashStatus = 'idle' | 'ready' | 'running' | 'success' | 'cancelled' | 'timeout' | 'error';

const workerClient = new FileHashWorkerClient();
const legacyAlgorithms: ReadonlySet<FileHashAlgorithm> = new Set(FILE_HASH_LEGACY_ALGORITHMS);
const selectedFile = shallowRef<File>();
const selectedAlgorithms = ref<FileHashAlgorithm[]>(['SHA-256']);
const hashResult = shallowRef<FileHashResult>();
const progress = reactive({ bytesProcessed: 0, totalBytes: 0 });
const state = reactive<{
  status: HashStatus
  message: string
  elapsedMs: number
}>({
  status: 'idle',
  message: 'Select a local file, then choose Hash file. Nothing is processed on selection.',
  elapsedMs: 0,
});
const { copy } = useCopy({ createToast: true });

let latestTaskId = 0;

const isRunning = computed(() => state.status === 'running');
const displayedFileName = computed(() => (
  selectedFile.value ? sanitizeFileNameForDisplay(selectedFile.value.name) : ''
));
const progressPercentage = computed(() => {
  if (state.status === 'success') {
    return 100;
  }

  if (progress.totalBytes === 0) {
    return 0;
  }

  return Math.min(100, Math.floor(progress.bytesProcessed / progress.totalBytes * 100));
});
const canHash = computed(() => (
  selectedFile.value !== undefined
  && Number.isSafeInteger(selectedFile.value.size)
  && selectedFile.value.size >= 0
  && selectedFile.value.size <= FILE_HASH_MAX_FILE_BYTES
  && selectedAlgorithms.value.length > 0
  && !isRunning.value
));
const statusIsError = computed(() => state.status === 'timeout' || state.status === 'error');

function isLegacyAlgorithm(algorithm: FileHashAlgorithm): boolean {
  return legacyAlgorithms.has(algorithm);
}

function formatElapsedTime(elapsedMs: number): string {
  if (elapsedMs < 1) {
    return '<1 ms';
  }

  return elapsedMs < 1_000
    ? `${Math.round(elapsedMs)} ms`
    : `${(elapsedMs / 1_000).toFixed(2)} s`;
}

function resetResult(): void {
  hashResult.value = undefined;
  progress.bytesProcessed = 0;
  progress.totalBytes = selectedFile.value?.size ?? 0;
  state.elapsedMs = 0;
}

function selectFile(file: File): void {
  ++latestTaskId;
  workerClient.cancel('File hashing cancelled because a different file was selected.');
  selectedFile.value = file;
  resetResult();

  if (!Number.isSafeInteger(file.size) || file.size < 0 || file.size > FILE_HASH_MAX_FILE_BYTES) {
    state.status = 'error';
    state.message = `The selected file exceeds the ${FILE_HASH_MAX_FILE_LABEL} limit.`;
    return;
  }

  state.status = 'ready';
  state.message = 'File selected. Choose one or more algorithms, then select Hash file.';
}

function setAlgorithm(algorithm: FileHashAlgorithm, checked: boolean): void {
  const updated = new Set(selectedAlgorithms.value);
  if (checked) {
    updated.add(algorithm);
  }
  else {
    updated.delete(algorithm);
  }

  selectedAlgorithms.value = FILE_HASH_ALGORITHMS.filter(item => updated.has(item));
  ++latestTaskId;
  workerClient.cancel('File hashing cancelled because the algorithm selection changed.');
  resetResult();

  if (selectedAlgorithms.value.length === 0) {
    state.status = 'error';
    state.message = 'Select at least one hashing algorithm.';
  }
  else if (selectedFile.value) {
    state.status = 'ready';
    state.message = 'Algorithm selection changed. Select Hash file to calculate new digests.';
  }
  else {
    state.status = 'idle';
    state.message = 'Select a local file, then choose Hash file. Nothing is processed on selection.';
  }
}

function updateAlgorithm(algorithm: FileHashAlgorithm, checked: boolean): void {
  setAlgorithm(algorithm, checked);
}

async function hashFile(): Promise<void> {
  const file = selectedFile.value;
  const algorithms = [...selectedAlgorithms.value];
  if (!file || !canHash.value) {
    state.status = 'error';
    state.message = algorithms.length === 0
      ? 'Select at least one hashing algorithm.'
      : 'Select a file within the supported size limit.';
    return;
  }

  const taskId = ++latestTaskId;
  resetResult();
  state.status = 'running';
  state.message = 'Hashing locally in a dedicated worker…';

  try {
    const result = await workerClient.run({ file, algorithms }, (nextProgress) => {
      if (taskId !== latestTaskId) {
        return;
      }

      progress.bytesProcessed = nextProgress.bytesProcessed;
      progress.totalBytes = nextProgress.totalBytes;
    });

    if (
      taskId !== latestTaskId
      || selectedFile.value !== file
      || algorithms.length !== selectedAlgorithms.value.length
      || algorithms.some((algorithm, index) => algorithm !== selectedAlgorithms.value[index])
    ) {
      return;
    }

    hashResult.value = result.value;
    progress.bytesProcessed = result.value.fileSize;
    progress.totalBytes = result.value.fileSize;
    state.status = 'success';
    state.elapsedMs = result.elapsedMs;
    state.message = `Hashing completed in ${formatElapsedTime(result.elapsedMs)}.`;
  }
  catch (error) {
    if (taskId !== latestTaskId) {
      return;
    }

    const taskError = toFileHashTaskError(error);
    hashResult.value = undefined;
    state.elapsedMs = taskError.elapsedMs;
    state.message = taskError.message;
    state.status = taskError.code === 'cancelled'
      ? 'cancelled'
      : taskError.code === 'timeout'
        ? 'timeout'
        : 'error';
  }
}

function cancelHashing(): void {
  if (!isRunning.value) {
    return;
  }

  ++latestTaskId;
  workerClient.cancel('File hashing cancelled.');
  resetResult();
  state.status = 'cancelled';
  state.message = 'File hashing cancelled.';
}

function clear(): void {
  ++latestTaskId;
  workerClient.cancel('File hashing cancelled because the tool was cleared.');
  selectedFile.value = undefined;
  selectedAlgorithms.value = ['SHA-256'];
  resetResult();
  state.status = 'idle';
  state.message = 'Selection and digests cleared. Choose a local file to start again.';
}

async function copyDigest(algorithm: FileHashAlgorithm, hex: string): Promise<void> {
  await copy(hex, { notificationMessage: `${algorithm} digest copied to the clipboard` });
}

onUnmounted(() => {
  ++latestTaskId;
  selectedFile.value = undefined;
  hashResult.value = undefined;
  workerClient.dispose();
});
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Local and session-only">
      File contents are processed only in this browser and are never uploaded or persisted by IT Tools. Application references are released when you clear, leave, or reload this tool.
    </c-alert>

    <c-card class="c-task-options" title="Local file">
      <c-file-upload
        data-test-id="file-hash-upload"
        :title="`Drop one file here, or select a file (maximum ${FILE_HASH_MAX_FILE_LABEL})`"
        @file-upload="selectFile"
      />

      <div v-if="selectedFile" mt-4 data-test-id="file-hash-selection">
        <p>
          <span font-600>Selected:</span>
          <bdi data-test-id="file-hash-name">{{ displayedFileName }}</bdi>
        </p>
        <p mt-1 text-sm op-70>
          {{ formatBytes(selectedFile.size) }} ({{ selectedFile.size.toLocaleString('en-US') }} bytes)
        </p>
      </div>
    </c-card>

    <c-card class="c-task-options" title="Algorithms">
      <div flex flex-wrap gap-x-6 gap-y-2>
        <CCheckbox
          v-for="algorithm in FILE_HASH_ALGORITHMS"
          :key="algorithm"
          :checked="selectedAlgorithms.includes(algorithm)"
          :disabled="isRunning"
          :test-id="`file-hash-algorithm-${algorithm}`"
          @update:checked="updateAlgorithm(algorithm, $event)"
        >
          {{ algorithm }}
          <span
            v-if="isLegacyAlgorithm(algorithm)"
            :data-test-id="`file-hash-legacy-${algorithm}`"
            op-65
          >
            (legacy)
          </span>
        </CCheckbox>
      </div>
      <p mt-3 text-sm op-70>
        MD5 and SHA-1 are legacy compatibility checksums with known collision attacks.
        Prefer SHA-256 or newer for integrity. File hashes are not suitable for storing passwords.
      </p>
    </c-card>

    <div class="c-task-actions">
      <c-button
        type="primary"
        data-test-id="file-hash-run"
        :disabled="!canHash"
        @click="hashFile"
      >
        Hash file
      </c-button>
      <c-button
        v-if="isRunning"
        type="warning"
        data-test-id="file-hash-cancel"
        :disabled="!isRunning"
        @click="cancelHashing"
      >
        Cancel
      </c-button>
      <c-button data-test-id="file-hash-clear" @click="clear">
        Clear
      </c-button>
    </div>

    <n-progress
      v-if="isRunning"
      data-test-id="file-hash-progress"
      type="line"
      :percentage="progressPercentage"
      :show-indicator="false"
      processing
    />
    <p
      v-if="isRunning"
      data-test-id="file-hash-progress-bytes"
      :data-bytes-processed="progress.bytesProcessed"
      :data-total-bytes="progress.totalBytes"
      text-center
      text-sm
      op-70
    >
      {{ formatBytes(progress.bytesProcessed) }} of {{ formatBytes(progress.totalBytes) }}
    </p>

    <p
      data-test-id="file-hash-status"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      min-h-5
      text-sm
      class="c-task-status"
      :class="{
        'status-error': statusIsError,
        'status-success': state.status === 'success',
      }"
    >
      {{ state.message }}
    </p>

    <section
      v-if="hashResult"
      class="c-task-results"
      data-test-id="file-hash-results"
      aria-label="File digests"
    >
      <h2 mb-3 text-lg font-600>
        Digests
      </h2>
      <div flex flex-col gap-3>
        <c-card v-for="digest in hashResult.digests" :key="digest.algorithm">
          <div flex flex-col gap-2 md:flex-row md:items-center>
            <span min-w-70px font-600>{{ digest.algorithm }}</span>
            <code
              :data-test-id="`file-hash-result-${digest.algorithm}`"
              flex-1 break-all rounded bg-gray-100 px-3 py-2 text-xs dark:bg-gray-800
            >{{ digest.hex }}</code>
            <c-button
              :data-test-id="`file-hash-copy-${digest.algorithm}`"
              @click="copyDigest(digest.algorithm, digest.hex)"
            >
              Copy
            </c-button>
          </div>
        </c-card>
      </div>
    </section>
  </div>
</template>

<style scoped>
.status-error {
  color: var(--n-feedback-text-color-error, #d03050);
}

.status-success {
  color: var(--n-feedback-text-color-success, #18a058);
}
</style>
