<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import { BcryptWorkerClient } from './bcrypt.worker-client';
import {
  BCRYPT_DEFAULT_ROUNDS,
  BCRYPT_MAX_PASSWORD_BYTES,
  BCRYPT_MAX_ROUNDS,
  BCRYPT_MIN_ROUNDS,
  toBcryptTaskError,
} from './bcrypt.worker.protocol';
import { useCopy } from '@/composable/copy';
import CInputNumber from '@/ui/c-input-number/c-input-number.vue';

type TaskStatus = 'idle' | 'running' | 'success' | 'cancelled' | 'timeout' | 'error';

interface TaskViewState {
  status: TaskStatus
  progress: number
  elapsedMs: number
  message: string
}

const themeVars = useThemeVars();
const workerClient = new BcryptWorkerClient();

const input = ref('');
const saltCount = ref<number | null>(BCRYPT_DEFAULT_ROUNDS);
const hashed = ref('');
const { copy } = useCopy({ source: hashed, text: 'Hashed string copied to the clipboard' });

const compareString = ref('');
const compareHash = ref('');
const compareMatch = ref<boolean | null>(null);

const hashState = reactive<TaskViewState>({
  status: 'idle',
  progress: 0,
  elapsedMs: 0,
  message: '',
});
const compareState = reactive<TaskViewState>({
  status: 'idle',
  progress: 0,
  elapsedMs: 0,
  message: '',
});

let hashAttempt = 0;
let compareAttempt = 0;

function resetState(state: TaskViewState): void {
  state.status = 'idle';
  state.progress = 0;
  state.elapsedMs = 0;
  state.message = '';
}

function beginTask(state: TaskViewState): number {
  state.status = 'running';
  state.progress = 0;
  state.elapsedMs = 0;
  state.message = '';

  const startedAt = performance.now();
  return window.setInterval(() => {
    state.elapsedMs = Math.max(0, performance.now() - startedAt);
  }, 100);
}

function applyTaskError(state: TaskViewState, error: unknown): void {
  const taskError = toBcryptTaskError(error);
  state.elapsedMs = taskError.elapsedMs;
  state.message = taskError.message;

  if (taskError.code === 'cancelled') {
    state.status = 'cancelled';
  }
  else if (taskError.code === 'timeout') {
    state.status = 'timeout';
  }
  else {
    state.status = 'error';
  }
}

async function runHash(): Promise<void> {
  const attempt = ++hashAttempt;
  const value = input.value;
  const rounds = saltCount.value ?? Number.NaN;
  hashed.value = '';
  const elapsedTimer = beginTask(hashState);

  try {
    const result = await workerClient.run(
      { operation: 'hash', value, rounds },
      (progress) => {
        if (attempt === hashAttempt) {
          hashState.progress = progress;
        }
      },
    );

    if (attempt !== hashAttempt || input.value !== value || saltCount.value !== rounds) {
      return;
    }

    hashed.value = result.value;
    hashState.status = 'success';
    hashState.progress = 1;
    hashState.elapsedMs = result.elapsedMs;
  }
  catch (error) {
    if (attempt === hashAttempt) {
      applyTaskError(hashState, error);
    }
  }
  finally {
    window.clearInterval(elapsedTimer);
  }
}

async function runCompare(): Promise<void> {
  const attempt = ++compareAttempt;
  const value = compareString.value;
  const hash = compareHash.value;
  compareMatch.value = null;
  const elapsedTimer = beginTask(compareState);

  try {
    const result = await workerClient.run(
      { operation: 'compare', value, hash },
      (progress) => {
        if (attempt === compareAttempt) {
          compareState.progress = progress;
        }
      },
    );

    if (attempt !== compareAttempt || compareString.value !== value || compareHash.value !== hash) {
      return;
    }

    compareMatch.value = result.value;
    compareState.status = 'success';
    compareState.progress = 1;
    compareState.elapsedMs = result.elapsedMs;
  }
  catch (error) {
    if (attempt === compareAttempt) {
      applyTaskError(compareState, error);
    }
  }
  finally {
    window.clearInterval(elapsedTimer);
  }
}

function cancelHash(): void {
  if (hashState.status === 'running') {
    workerClient.cancel('Hashing cancelled.');
  }
}

function cancelCompare(): void {
  if (compareState.status === 'running') {
    workerClient.cancel('Comparison cancelled.');
  }
}

function formatElapsed(elapsedMs: number): string {
  if (elapsedMs < 1) {
    return '<1 ms';
  }

  if (elapsedMs < 1000) {
    return `${Math.round(elapsedMs)} ms`;
  }

  return `${(elapsedMs / 1000).toFixed(2)} s`;
}

function isWholeNumber(value: number): boolean {
  return Number.isInteger(value);
}

function getStatusText(label: string, state: TaskViewState): string {
  if (state.status === 'idle') {
    return '';
  }

  if (state.status === 'running') {
    return `${label} running: ${Math.round(state.progress * 100)}% · ${formatElapsed(state.elapsedMs)}`;
  }

  if (state.status === 'success') {
    return `${label} completed in ${formatElapsed(state.elapsedMs)}.`;
  }

  return state.message;
}

const hashStatusText = computed(() => getStatusText('Hash', hashState));
const compareStatusText = computed(() => getStatusText('Comparison', compareState));

watch([input, saltCount], () => {
  const wasRunning = hashState.status === 'running';
  ++hashAttempt;
  hashed.value = '';

  if (wasRunning) {
    workerClient.cancel('Hashing cancelled because its input changed.');
    hashState.status = 'cancelled';
    hashState.message = 'Hashing cancelled because its input changed.';
  }
  else {
    resetState(hashState);
  }
}, { flush: 'sync' });

watch([compareString, compareHash], () => {
  const wasRunning = compareState.status === 'running';
  ++compareAttempt;
  compareMatch.value = null;

  if (wasRunning) {
    workerClient.cancel('Comparison cancelled because its input changed.');
    compareState.status = 'cancelled';
    compareState.message = 'Comparison cancelled because its input changed.';
  }
  else {
    resetState(compareState);
  }
}, { flush: 'sync' });

onUnmounted(() => {
  ++hashAttempt;
  ++compareAttempt;
  workerClient.dispose();
});
</script>

<template>
  <div class="c-task-layout">
    <c-card title="Hash">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-input-text
          v-model:value="input"
          placeholder="Your string to bcrypt..."
          raw-text
          label="String to hash"
          test-id="bcrypt-input"
        />
        <c-field
          :label="`Salt rounds (${BCRYPT_MIN_ROUNDS}–${BCRYPT_MAX_ROUNDS})`"
          label-for="bcrypt-rounds"
          :description="`Input is limited to ${BCRYPT_MAX_PASSWORD_BYTES} UTF-8 bytes.`"
        >
          <CInputNumber
            id="bcrypt-rounds"
            v-model:value="saltCount"
            test-id="bcrypt-rounds"
            placeholder="Salt rounds..."
            :max="BCRYPT_MAX_ROUNDS"
            :min="BCRYPT_MIN_ROUNDS"
            :validator="isWholeNumber"
          />
        </c-field>
      </div>

      <c-input-text
        class="mt-4"
        :value="hashed"
        label="Generated bcrypt hash"
        test-id="bcrypt-hash-output"

        raw-text readonly monospace
      />

      <n-progress
        v-if="hashState.status === 'running'"
        class="mt-3"
        type="line"
        :percentage="Math.round(hashState.progress * 100)"
        :show-indicator="false"
        processing
      />

      <p
        v-if="hashStatusText"
        class="c-task-status"
        data-test-id="bcrypt-hash-status"
        role="status"
        aria-live="polite"
        mt-3
        text-sm
        :class="{ 'status-error': hashState.status === 'error' || hashState.status === 'timeout' }"
      >
        {{ hashStatusText }}
      </p>

      <div class="c-task-actions mt-4">
        <c-button type="primary" data-test-id="bcrypt-hash-run" @click="runHash">
          {{ hashState.status === 'running' ? 'Restart hash' : 'Generate hash' }}
        </c-button>
        <c-button v-if="hashState.status === 'running'" type="warning" data-test-id="bcrypt-hash-cancel" @click="cancelHash">
          Cancel
        </c-button>
        <c-button :disabled="!hashed" data-test-id="bcrypt-hash-copy" @click="copy()">
          Copy hash
        </c-button>
      </div>
    </c-card>

    <c-card title="Compare string with hash">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-input-text v-model:value="compareString" label="String to compare" test-id="bcrypt-compare-input" placeholder="Your string to compare..." raw-text />
        <c-input-text v-model:value="compareHash" label="Bcrypt hash" test-id="bcrypt-compare-hash" placeholder="Your hash to compare..." raw-text monospace />
      </div>

      <c-field v-if="compareMatch !== null" label="Do they match?" class="mt-4">
        <div data-test-id="bcrypt-compare-result" class="compare-result" :class="{ positive: compareMatch }">
          {{ compareMatch ? 'Yes' : 'No' }}
        </div>
      </c-field>

      <n-progress
        v-if="compareState.status === 'running'"
        class="mb-3"
        type="line"
        :percentage="Math.round(compareState.progress * 100)"
        :show-indicator="false"
        processing
      />

      <p
        v-if="compareStatusText"
        data-test-id="bcrypt-compare-status"
        role="status"
        aria-live="polite"
        mb-3
        text-sm
        :class="{ 'status-error': compareState.status === 'error' || compareState.status === 'timeout' }"
      >
        {{ compareStatusText }}
      </p>

      <div class="c-task-actions">
        <c-button type="primary" data-test-id="bcrypt-compare-run" @click="runCompare">
          {{ compareState.status === 'running' ? 'Restart comparison' : 'Compare' }}
        </c-button>
        <c-button v-if="compareState.status === 'running'" type="warning" data-test-id="bcrypt-compare-cancel" @click="cancelCompare">
          Cancel
        </c-button>
      </div>
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.compare-result {
  color: v-bind('themeVars.errorColor');

  &.positive {
    color: v-bind('themeVars.successColor');
  }
}

.status-error {
  color: v-bind('themeVars.errorColor');
}
</style>
