<script setup lang="ts">
import type { AesEnvelopeResult, AesEnvelopeTask } from './aes-gcm-envelope.worker.protocol';
import { AES_ENVELOPE_ITERATIONS, AES_ENVELOPE_MAX_BYTES, AES_ENVELOPE_MAX_FILE_BYTES } from './aes-gcm-envelope.service';
import { AesEnvelopeWorkerClient } from './aes-gcm-envelope.worker-client';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';
import { formatBytes } from '@/utils/convert';
import { downloadBlobFile } from '@/utils/standalone-host';

type Mode = AesEnvelopeTask['operation'];
const mode = ref<Mode>('encrypt-text');
const passphrase = ref('');
const confirmPassphrase = ref('');
const textInput = ref('');
const base64Input = ref('');
const selectedFile = shallowRef<File>();
const textOutput = ref('');
const result = shallowRef<AesEnvelopeResult>();
const resultBlob = shallowRef<Blob>();
const resultUrl = ref('');
const resultFileName = ref('');
const error = ref('');
const status = ref('Ready.');
const isRunning = ref(false);
const revision = ref(0);
const completedRevision = ref(-1);
const client = new AesEnvelopeWorkerClient();
let operationId = 0;

watch([mode, passphrase, confirmPassphrase, textInput, base64Input], () => {
  revision.value += 1;
});

const isEncrypting = computed(() => mode.value === 'encrypt-text' || mode.value === 'encrypt-file');
const stale = computed(() => Boolean(result.value && completedRevision.value !== revision.value));
const passphraseValid = computed(() => Array.from(passphrase.value).length >= 12);
const canRun = computed(() => {
  if (isRunning.value || !passphraseValid.value || (isEncrypting.value && passphrase.value !== confirmPassphrase.value)) {
    return false;
  }
  if (mode.value === 'encrypt-text') {
    return Boolean(textInput.value);
  }
  if (mode.value === 'decrypt-text') {
    return Boolean(base64Input.value.trim());
  }
  if (!selectedFile.value) {
    return false;
  }
  return selectedFile.value.size <= (mode.value === 'encrypt-file' ? AES_ENVELOPE_MAX_FILE_BYTES : AES_ENVELOPE_MAX_BYTES);
});
const { copy } = useCopy({ source: textOutput, text: 'AES-GCM result copied' });

function clearResult() {
  if (resultUrl.value) {
    URL.revokeObjectURL(resultUrl.value);
  }
  resultUrl.value = '';
  resultBlob.value = undefined;
  resultFileName.value = '';
  result.value = undefined;
  textOutput.value = '';
  completedRevision.value = -1;
}

function selectFile(file: File) {
  operationId += 1;
  client.cancel('The AES-GCM task was replaced by a new file.');
  clearResult();
  selectedFile.value = file;
  revision.value += 1;
  error.value = '';
  isRunning.value = false;
  const limit = mode.value === 'encrypt-file' ? AES_ENVELOPE_MAX_FILE_BYTES : AES_ENVELOPE_MAX_BYTES;
  status.value = file.size <= limit ? 'File selected. Run the explicit local task.' : `The file exceeds the ${formatBytes(limit)} limit.`;
}

watch(mode, () => {
  operationId += 1;
  client.cancel('The AES-GCM task was replaced by a mode change.');
  clearResult();
  selectedFile.value = undefined;
  error.value = '';
  isRunning.value = false;
  status.value = 'Ready.';
});

function currentTask(): AesEnvelopeTask {
  if (mode.value === 'encrypt-text') {
    return { operation: mode.value, passphrase: passphrase.value, text: textInput.value };
  }
  if (mode.value === 'decrypt-text') {
    return { operation: mode.value, passphrase: passphrase.value, base64: base64Input.value };
  }
  const file = selectedFile.value;
  if (!file) {
    throw new TypeError('Select one local file.');
  }
  if (mode.value === 'encrypt-file') {
    return { operation: mode.value, passphrase: passphrase.value, file, fileName: file.name, mimeType: file.type };
  }
  return { operation: mode.value, passphrase: passphrase.value, file };
}

async function run() {
  if (!canRun.value) {
    return;
  }
  const currentOperation = ++operationId;
  const taskRevision = revision.value;
  isRunning.value = true;
  error.value = '';
  status.value = `Running PBKDF2 and AES-GCM locally (${AES_ENVELOPE_ITERATIONS.toLocaleString('en-US')} iterations)…`;
  try {
    const completed = await client.run(currentTask());
    if (currentOperation !== operationId) {
      return;
    }
    clearResult();
    result.value = completed.value;
    if (completed.value.kind === 'encrypted-text') {
      textOutput.value = completed.value.base64;
    }
    else if (completed.value.kind === 'decrypted-text') {
      textOutput.value = completed.value.text;
    }
    else if (completed.value.kind === 'encrypted-file') {
      resultBlob.value = new Blob([completed.value.output], { type: 'application/octet-stream' });
      resultUrl.value = URL.createObjectURL(resultBlob.value);
      resultFileName.value = 'encrypted.itae';
    }
    else {
      resultBlob.value = new Blob([completed.value.output], { type: completed.value.mimeType });
      resultUrl.value = URL.createObjectURL(resultBlob.value);
      resultFileName.value = completed.value.fileName;
    }
    completedRevision.value = taskRevision;
    status.value = `Completed locally in ${completed.elapsedMs.toFixed(0)} ms.`;
  }
  catch (caught) {
    if (currentOperation === operationId) {
      error.value = caught instanceof Error ? caught.message : 'AES-GCM processing failed.';
      status.value = 'Task failed.';
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
  status.value = 'Task cancelled.';
}

async function downloadFile() {
  if (!resultBlob.value || !resultFileName.value) {
    return;
  }
  await downloadBlobFile(resultBlob.value, resultFileName.value);
}

function clearSensitiveData() {
  operationId += 1;
  client.cancel('The AES-GCM task was cancelled while clearing sensitive data.');
  clearResult();
  passphrase.value = '';
  confirmPassphrase.value = '';
  textInput.value = '';
  base64Input.value = '';
  selectedFile.value = undefined;
  isRunning.value = false;
  error.value = '';
  status.value = 'Sensitive fields cleared.';
}

onBeforeUnmount(() => {
  operationId += 1;
  client.dispose();
  clearResult();
  selectedFile.value = undefined;
  passphrase.value = '';
  confirmPassphrase.value = '';
  textInput.value = '';
  base64Input.value = '';
});
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Authenticated local envelope — ITAE v1">
      Uses Web Crypto AES-256-GCM with a fresh 16-byte salt, fresh 12-byte IV, 128-bit tag, and PBKDF2-HMAC-SHA-256 at {{ AES_ENVELOPE_ITERATIONS.toLocaleString('en-US') }} iterations. The versioned header is authenticated; file name and media type are encrypted. Inputs and passphrases are never persisted or sent. Losing the passphrase makes recovery impossible, and this format is IT Tools-specific rather than a general interchange standard.
    </c-alert>
    <c-card class="c-task-options" title="Operation and passphrase">
      <c-select v-model:value="mode" label="Operation" :options="[{ label: 'Encrypt text → Base64 envelope', value: 'encrypt-text' }, { label: 'Decrypt Base64 envelope → text', value: 'decrypt-text' }, { label: 'Encrypt local file → .itae', value: 'encrypt-file' }, { label: 'Decrypt local .itae file', value: 'decrypt-file' }]" />
      <div grid grid-cols-1 mt-3 gap-3 md:grid-cols-2>
        <c-input-text v-model:value="passphrase" label="Passphrase (12+ characters)" type="password" :maxlength="1024" raw-text data-test-id="aes-passphrase" />
        <c-input-text v-if="isEncrypting" v-model:value="confirmPassphrase" label="Confirm passphrase" type="password" :maxlength="1024" raw-text data-test-id="aes-passphrase-confirm" />
      </div>
      <c-alert v-if="isEncrypting && confirmPassphrase && passphrase !== confirmPassphrase" title="Passphrases do not match" mt-3>
        Encryption stays disabled until both passphrase fields are identical.
      </c-alert>
    </c-card>

    <c-input-text v-if="mode === 'encrypt-text'" v-model:value="textInput" label="Plaintext (maximum 1 MiB UTF-8)" raw-text multiline :rows="12" data-test-id="aes-text-input" />
    <c-input-text v-else-if="mode === 'decrypt-text'" v-model:value="base64Input" label="ITAE v1 envelope (standard Base64)" raw-text multiline monospace :rows="12" data-test-id="aes-base64-input" />
    <c-card v-else title="Local file">
      <c-file-upload
        :disabled="isRunning"
        data-test-id="aes-file-upload"
        :title="mode === 'encrypt-file' ? 'Choose a local file up to 32 MiB' : 'Choose one ITAE v1 file up to 32 MiB plus envelope overhead'"
        @file-upload="selectFile"
      />
      <div v-if="selectedFile" mt-3>
        <p><strong>Name:</strong> <bdi>{{ selectedFile.name }}</bdi></p>
        <p><strong>Size:</strong> {{ formatBytes(selectedFile.size) }}</p>
      </div>
    </c-card>

    <div class="c-task-actions">
      <c-button type="primary" :disabled="!canRun" data-test-id="aes-run" @click="run">
        {{ isRunning ? 'Processing…' : 'Run locally' }}
      </c-button>
      <c-button v-if="isRunning" @click="cancel">
        Cancel
      </c-button>
      <c-button @click="clearSensitiveData">
        Clear sensitive data
      </c-button>
    </div>
    <p class="c-task-status" data-test-id="aes-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="error" title="AES-GCM envelope error" data-test-id="aes-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="stale" title="Result uses previous inputs">
      Run again to apply the current operation, passphrase, or content.
    </c-alert>

    <template v-if="result && (result.kind === 'encrypted-text' || result.kind === 'decrypted-text')">
      <c-input-text :value="textOutput" :label="result.kind === 'encrypted-text' ? 'Authenticated Base64 envelope' : 'Authenticated plaintext'" raw-text :monospace="result.kind === 'encrypted-text'" multiline readonly :rows="14" data-test-id="aes-text-output" />
      <div class="c-task-actions">
        <c-button @click="copy()">
          Copy
        </c-button>
        <c-button @click="downloadTextFile({ content: textOutput, filename: result.kind === 'encrypted-text' ? 'encrypted-text.itae.txt' : 'decrypted-text.txt' })">
          Download
        </c-button>
      </div>
    </template>
    <c-card v-else-if="result && resultBlob && resultUrl" title="Authenticated file result" data-test-id="aes-file-result">
      <p><strong>Input:</strong> {{ formatBytes(result.inputBytes) }}</p>
      <p><strong>Output:</strong> {{ formatBytes(result.outputBytes) }}</p>
      <p><strong>Download name:</strong> <bdi>{{ resultFileName }}</bdi></p>
      <div class="c-task-actions" mt-3>
        <c-button type="primary" @click="downloadFile">
          Download file
        </c-button>
      </div>
    </c-card>
  </div>
</template>
