<script setup lang="ts">
import {
  ARGON2ID_DEFAULT_PARAMETERS,
  ARGON2ID_HASH_LENGTH_MAX_BYTES,
  ARGON2ID_HASH_LENGTH_MIN_BYTES,
  ARGON2ID_ITERATIONS_MAX,
  ARGON2ID_ITERATIONS_MIN,
  ARGON2ID_MEMORY_MAX_KIB,
  ARGON2ID_MEMORY_MIN_KIB,
  ARGON2ID_PARALLELISM_MAX,
  ARGON2ID_PARALLELISM_MIN,
  ARGON2ID_PASSWORD_MAX_BYTES,
  ARGON2ID_PHC_MAX_CHARACTERS,
  ARGON2ID_RANDOM_UNAVAILABLE_MESSAGE,
  createArgon2idSalt,
} from './argon2id.service';
import { type Argon2idTask, Argon2idTaskError } from './argon2id.worker.protocol';
import { Argon2idWorkerClient } from './argon2id.worker-client';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';

type Mode = Argon2idTask['operation'];

const mode = ref<Mode>('hash');
const password = ref('');
const phcInput = ref('');
const memoryKiB = ref<number | null>(ARGON2ID_DEFAULT_PARAMETERS.memoryKiB);
const iterations = ref<number | null>(ARGON2ID_DEFAULT_PARAMETERS.iterations);
const parallelism = ref<number | null>(ARGON2ID_DEFAULT_PARAMETERS.parallelism);
const hashLength = ref<number | null>(ARGON2ID_DEFAULT_PARAMETERS.hashLength);
const output = ref('');
const matches = ref<boolean>();
const status = ref('Ready. Sensitive values stay in memory only.');
const error = ref('');
const isRunning = ref(false);
const client = new Argon2idWorkerClient();
let operationId = 0;

const numericParametersValid = computed(() => (
  Number.isSafeInteger(memoryKiB.value) && memoryKiB.value! >= ARGON2ID_MEMORY_MIN_KIB && memoryKiB.value! <= ARGON2ID_MEMORY_MAX_KIB
  && Number.isSafeInteger(iterations.value) && iterations.value! >= ARGON2ID_ITERATIONS_MIN && iterations.value! <= ARGON2ID_ITERATIONS_MAX
  && Number.isSafeInteger(parallelism.value) && parallelism.value! >= ARGON2ID_PARALLELISM_MIN && parallelism.value! <= ARGON2ID_PARALLELISM_MAX
  && Number.isSafeInteger(hashLength.value) && hashLength.value! >= ARGON2ID_HASH_LENGTH_MIN_BYTES && hashLength.value! <= ARGON2ID_HASH_LENGTH_MAX_BYTES
  && memoryKiB.value! >= 8 * parallelism.value!
));
const canRun = computed(() => !isRunning.value && Boolean(password.value)
  && (mode.value === 'hash' ? numericParametersValid.value : Boolean(phcInput.value)));
const { copy } = useCopy({ source: output, text: 'Argon2id PHC string copied' });

function clearResult() {
  output.value = '';
  matches.value = undefined;
  error.value = '';
}

watch([mode, password, phcInput, memoryKiB, iterations, parallelism, hashLength], () => {
  if (isRunning.value) {
    operationId += 1;
    client.cancel('Argon2id processing was cancelled because an input changed.');
    isRunning.value = false;
    status.value = 'Input changed; the previous worker was terminated.';
  }
  clearResult();
});

function currentTask(): Argon2idTask {
  if (mode.value === 'verify') {
    return { operation: 'verify', password: password.value, phc: phcInput.value.trim() };
  }
  return {
    operation: 'hash',
    password: password.value,
    salt: createArgon2idSalt(),
    memoryKiB: memoryKiB.value as number,
    iterations: iterations.value as number,
    parallelism: parallelism.value as number,
    hashLength: hashLength.value as number,
  };
}

async function run() {
  if (!canRun.value) {
    return;
  }
  const currentOperation = ++operationId;
  isRunning.value = true;
  clearResult();
  status.value = mode.value === 'hash'
    ? `Hashing locally with ${(memoryKiB.value! / 1024).toLocaleString('en-US')} MiB in a disposable worker…`
    : 'Verifying locally in a disposable worker…';
  try {
    const completed = await client.run(currentTask());
    if (currentOperation !== operationId) {
      return;
    }
    if (completed.value.operation === 'hash') {
      output.value = completed.value.phc;
    }
    else {
      matches.value = completed.value.matches;
    }
    status.value = `Completed locally in ${Math.round(completed.elapsedMs).toLocaleString('en-US')} ms; the worker was terminated.`;
  }
  catch (caught) {
    if (currentOperation !== operationId) {
      return;
    }
    error.value = caught instanceof Argon2idTaskError || (caught instanceof Error && caught.message === ARGON2ID_RANDOM_UNAVAILABLE_MESSAGE)
      ? caught.message
      : 'The local Argon2id operation failed.';
    status.value = caught instanceof Argon2idTaskError && caught.code === 'cancelled' ? 'Operation cancelled.' : 'Operation failed.';
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
  clearResult();
  status.value = 'Operation cancelled; the worker was terminated.';
}

function clearSensitiveData() {
  operationId += 1;
  client.cancel('Argon2id processing was cancelled while clearing sensitive values.');
  password.value = '';
  phcInput.value = '';
  clearResult();
  isRunning.value = false;
  status.value = 'Password, PHC input, and result cleared from this tool.';
}

onBeforeUnmount(() => {
  operationId += 1;
  client.dispose();
  password.value = '';
  phcInput.value = '';
  output.value = '';
});
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Local Argon2id utility — not a password database">
      Hashing and verification run only after you select an action, in a disposable browser worker. Passwords, salts, and PHC strings are not put in URLs, storage, logs, or network requests. JavaScript cannot guarantee zeroization of every temporary copy; clearing fields and closing the tab remains prudent.
    </c-alert>

    <c-card class="c-task-options" title="Operation">
      <c-buttons-select
        v-model:value="mode"
        label="Argon2id operation"
        label-position="top"
        :options="[{ label: 'Hash password', value: 'hash' }, { label: 'Verify PHC string', value: 'verify' }]"
      />
    </c-card>

    <c-input-text
      v-model:value="password"
      label="Password (1–1,024 UTF-8 bytes)"
      type="password"
      :maxlength="ARGON2ID_PASSWORD_MAX_BYTES"
      autocomplete="new-password"
      raw-text
      test-id="argon2id-password"
    />

    <template v-if="mode === 'hash'">
      <c-card class="c-task-options" title="Argon2id v=19 parameters">
        <c-alert title="RFC 9106 memory-constrained default">
          The defaults use 64 MiB, 3 iterations, 4 lanes, a fresh 16-byte Web Crypto salt, and a 32-byte tag. Calibrate memory and time on the system that will actually verify passwords; this browser result is an interoperable PHC value, not deployment policy.
        </c-alert>
        <div grid grid-cols-1 mt-3 gap-3 md:grid-cols-2>
          <c-field label="Memory (KiB)" label-for="argon2id-memory-input">
            <CInputNumber id="argon2id-memory-input" v-model:value="memoryKiB" test-id="argon2id-memory" :min="ARGON2ID_MEMORY_MIN_KIB" :max="ARGON2ID_MEMORY_MAX_KIB" />
          </c-field>
          <c-field label="Iterations" label-for="argon2id-iterations-input">
            <CInputNumber id="argon2id-iterations-input" v-model:value="iterations" test-id="argon2id-iterations" :min="ARGON2ID_ITERATIONS_MIN" :max="ARGON2ID_ITERATIONS_MAX" />
          </c-field>
          <c-field label="Parallelism / lanes" label-for="argon2id-parallelism-input">
            <CInputNumber id="argon2id-parallelism-input" v-model:value="parallelism" test-id="argon2id-parallelism" :min="ARGON2ID_PARALLELISM_MIN" :max="ARGON2ID_PARALLELISM_MAX" />
          </c-field>
          <c-field label="Tag length (bytes)" label-for="argon2id-hash-length-input">
            <CInputNumber id="argon2id-hash-length-input" v-model:value="hashLength" test-id="argon2id-hash-length" :min="ARGON2ID_HASH_LENGTH_MIN_BYTES" :max="ARGON2ID_HASH_LENGTH_MAX_BYTES" />
          </c-field>
        </div>
        <c-alert v-if="memoryKiB !== null && memoryKiB < 65536" type="warning" title="Below the RFC 9106 memory-constrained default" mt-3>
          Lower values are available for interoperability and constrained-device testing, but reduce memory cost. Do not adopt them as production defaults without a threat and performance review.
        </c-alert>
      </c-card>
    </template>
    <c-input-text
      v-else
      v-model:value="phcInput"
      label="Canonical Argon2id v=19 PHC string"
      :maxlength="ARGON2ID_PHC_MAX_CHARACTERS"
      raw-text
      monospace
      multiline
      :rows="6"
      test-id="argon2id-phc-input"
    />

    <div class="c-task-actions">
      <c-button type="primary" :disabled="!canRun" data-test-id="argon2id-run" @click="run">
        {{ isRunning ? 'Processing…' : mode === 'hash' ? 'Hash locally' : 'Verify locally' }}
      </c-button>
      <c-button v-if="isRunning" type="warning" data-test-id="argon2id-cancel" @click="cancel">
        Cancel
      </c-button>
      <c-button data-test-id="argon2id-clear" @click="clearSensitiveData">
        Clear sensitive values
      </c-button>
    </div>
    <p class="c-task-status" data-test-id="argon2id-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="error" title="Argon2id error" data-test-id="argon2id-error">
      {{ error }}
    </c-alert>

    <template v-if="mode === 'hash'">
      <c-input-text :value="output" label="Argon2id PHC string" raw-text monospace multiline readonly :rows="6" test-id="argon2id-output" />
      <div class="c-task-actions">
        <c-button :disabled="!output" data-test-id="argon2id-copy" @click="copy()">
          Copy
        </c-button>
        <c-button :disabled="!output" @click="downloadTextFile({ content: output, filename: 'argon2id.phc.txt' })">
          Download
        </c-button>
      </div>
    </template>
    <c-card v-else-if="matches !== undefined" title="Verification result" data-test-id="argon2id-verify-result">
      <p :class="matches ? 'text-success' : 'text-error'">
        {{ matches ? 'Password matches this Argon2id PHC string.' : 'Password does not match this Argon2id PHC string.' }}
      </p>
    </c-card>
  </div>
</template>
