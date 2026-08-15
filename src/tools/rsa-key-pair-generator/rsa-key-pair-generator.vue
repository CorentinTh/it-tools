<script setup lang="ts">
import { RsaWorkerClient } from './rsa-key-pair-generator.worker-client';
import {
  RSA_KEY_SIZES,
  type RsaKeyPair,
  type RsaKeySize,
  toRsaTaskError,
} from './rsa-key-pair-generator.worker.protocol';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

type RsaTaskStatus = 'idle' | 'ready' | 'running' | 'success' | 'cancelled' | 'timeout' | 'error';

const keySizeOptions = RSA_KEY_SIZES.map(bits => ({
  label: `${bits.toLocaleString('en-US')} bit`,
  value: bits,
}));
const selectedBits = ref<RsaKeySize>(2048);
const keyPair = shallowRef<RsaKeyPair>();
const workerClient = new RsaWorkerClient();
const state = reactive<{
  status: RsaTaskStatus
  message: string
  elapsedMs?: number
}>({
  status: 'idle',
  message: 'Choose a supported key size, then select Generate. No key is created automatically.',
});
const isRunning = computed(() => state.status === 'running');
const statusIsError = computed(() => state.status === 'error' || state.status === 'timeout');
let latestTaskId = 0;

function formatElapsedTime(elapsedMs: number): string {
  return elapsedMs < 1_000
    ? `${Math.max(1, Math.round(elapsedMs))} ms`
    : `${(elapsedMs / 1_000).toFixed(1)} s`;
}

function selectKeySize(bits: RsaKeySize): void {
  selectedBits.value = bits;
  if (isRunning.value) {
    return;
  }

  state.status = keyPair.value ? 'ready' : 'idle';
  state.elapsedMs = undefined;
  state.message = keyPair.value
    ? `Key size changed to ${bits.toLocaleString('en-US')} bit. The previous pair remains until you select Generate.`
    : `Ready to generate a ${bits.toLocaleString('en-US')}-bit RSA key pair.`;
}

async function generate(): Promise<void> {
  if (isRunning.value) {
    return;
  }

  const bits = selectedBits.value;
  const taskId = ++latestTaskId;
  state.status = 'running';
  state.elapsedMs = undefined;
  state.message = `Generating a ${bits.toLocaleString('en-US')}-bit RSA key pair locally…`;

  try {
    const result = await workerClient.run({ bits });
    if (taskId !== latestTaskId) {
      return;
    }

    keyPair.value = result.value;
    state.status = 'success';
    state.elapsedMs = result.elapsedMs;
    state.message = `Generated a ${bits.toLocaleString('en-US')}-bit RSA key pair in ${formatElapsedTime(result.elapsedMs)}.`;
  }
  catch (error) {
    if (taskId !== latestTaskId) {
      return;
    }

    const taskError = toRsaTaskError(error);
    state.elapsedMs = taskError.elapsedMs;
    state.status = taskError.code === 'cancelled'
      ? 'cancelled'
      : taskError.code === 'timeout'
        ? 'timeout'
        : 'error';
    state.message = taskError.message;
  }
}

function cancel(): void {
  if (!isRunning.value) {
    return;
  }

  ++latestTaskId;
  workerClient.cancel('RSA key generation cancelled.');
  state.status = 'cancelled';
  state.elapsedMs = undefined;
  state.message = keyPair.value
    ? 'RSA key generation cancelled. The previous pair is still available.'
    : 'RSA key generation cancelled.';
}

onUnmounted(() => {
  ++latestTaskId;
  keyPair.value = undefined;
  workerClient.dispose();
});
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Local and session-only">
      Key generation runs only in this browser. Private keys are never uploaded or persisted by IT Tools and are released when you leave or reload the tool.
    </c-alert>

    <c-card class="c-task-options" title="Key options">
      <c-buttons-select
        :value="selectedBits"
        :options="keySizeOptions"
        data-test-id="rsa-key-size"
        label="Key size"
        label-position="top"
        :disabled="isRunning"
        @update:value="selectKeySize"
      />
      <p mt-3 text-sm op-70>
        2,048 bit is the balanced default. 3,072 and 4,096 bit increase key size and generation time. The public exponent is fixed at 65,537.
      </p>
    </c-card>

    <div class="c-task-actions">
      <c-button
        type="primary"
        data-test-id="rsa-generate"
        :disabled="isRunning"
        @click="generate"
      >
        {{ keyPair ? 'Generate new pair' : 'Generate key pair' }}
      </c-button>
      <c-button
        v-if="isRunning"
        type="warning"
        data-test-id="rsa-cancel"
        @click="cancel"
      >
        Cancel
      </c-button>
    </div>

    <p
      data-test-id="rsa-status"
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
      v-if="keyPair"
      class="c-task-results c-tool-stack"
      data-test-id="rsa-results"
      :aria-label="`${keyPair.bits.toLocaleString('en-US')}-bit RSA key pair`"
    >
      <div class="c-tool-panel" data-test-id="rsa-public-key">
        <h2 mb-3 text-lg font-600>
          Public key
        </h2>
        <TextareaCopyable
          :value="keyPair.publicKeyPem"
          copy-placement="outside"
          copy-message="Copy public key"
        />
      </div>

      <div class="c-tool-panel" data-test-id="rsa-private-key">
        <h2 mb-3 text-lg font-600>
          Private key
        </h2>
        <TextareaCopyable
          :value="keyPair.privateKeyPem"
          copy-placement="outside"
          copy-message="Copy private key"
        />
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
