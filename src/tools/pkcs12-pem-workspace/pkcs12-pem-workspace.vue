<script setup lang="ts">
import { createPkcs12PemWorkerClient } from './pkcs12-pem-workspace.worker-client';
import { PKCS12_MAX_FILE_BYTES } from './pkcs12-pem-workspace.worker.protocol';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';

type Mode = 'pkcs12' | 'pem';
const mode = ref<Mode>('pkcs12');
const selectedFile = shallowRef<File>();
const password = ref('');
const pemSource = ref('');
const output = ref('');
const error = ref('');
const status = ref('Select a local .p12/.pfx file. Nothing is read until the explicit action.');
const running = ref(false);
const client = createPkcs12PemWorkerClient();
const { copy } = useCopy({ source: output, text: 'PKCS#12 / PEM report copied' });

watch(mode, () => {
  client.cancel();
  password.value = '';
  output.value = '';
  error.value = '';
  running.value = false;
  status.value = mode.value === 'pkcs12'
    ? 'Select a local .p12/.pfx file. Nothing is read until the explicit action.'
    : 'Paste public PEM blocks, then choose Inspect and normalize.';
});

function selectFile(file: File) {
  client.cancel();
  selectedFile.value = file;
  output.value = '';
  error.value = '';
  status.value = file.size > 0 && file.size <= PKCS12_MAX_FILE_BYTES
    ? `${file.name} selected (${file.size.toLocaleString('en-US')} bytes). Enter its ASCII password and inspect locally.`
    : 'The selected PKCS#12 file must be between 1 byte and 4 MiB.';
}

async function run() {
  running.value = true;
  error.value = '';
  status.value = 'Processing locally in a disposable worker…';
  try {
    const result = mode.value === 'pkcs12'
      ? selectedFile.value
        ? await client.run({ kind: 'pkcs12', file: selectedFile.value, password: password.value })
        : undefined
      : await client.run({ kind: 'pem', source: pemSource.value });
    if (!result) {
      throw new TypeError('Select one PKCS#12 file first.');
    }
    output.value = result.value;
    status.value = `Processing finished locally in ${Math.round(result.elapsedMs)} ms. Private key material was not exported.`;
  }
  catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'PKCS#12 / PEM processing failed.';
    status.value = 'Processing failed.';
  }
  finally {
    password.value = '';
    running.value = false;
  }
}

function cancel() {
  client.cancel('PKCS#12 / PEM processing cancelled.');
  password.value = '';
  running.value = false;
  status.value = 'Processing cancelled and the password was cleared.';
}

function clear() {
  client.cancel();
  selectedFile.value = undefined;
  password.value = '';
  pemSource.value = '';
  output.value = '';
  error.value = '';
  running.value = false;
  status.value = 'Local certificate content and password cleared.';
}

onBeforeUnmount(() => {
  client.dispose();
  password.value = '';
  pemSource.value = '';
  output.value = '';
  selectedFile.value = undefined;
});
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Certificate-safe workspace with a narrow private-key boundary">
      PKCS#12 integrity and password-protected safe contents are processed locally with Web Crypto. Certificates can be converted to PEM; private-key bags are counted but never extracted or displayed. PEM mode accepts certificates, CSRs, and public keys only. No chain, hostname, revocation, or trust decision is made. Legacy algorithms unavailable in the browser are rejected.
    </c-alert>
    <c-card class="c-task-options" title="Workspace mode">
      <c-select v-model:value="mode" label="Input format" :options="[{ label: 'PKCS#12 / PFX file', value: 'pkcs12' }, { label: 'Public PEM bundle', value: 'pem' }]" />
    </c-card>

    <template v-if="mode === 'pkcs12'">
      <c-file-upload
        accept=".p12,.pfx,application/x-pkcs12"
        title="Select one local PKCS#12 / PFX file (maximum 4 MiB)"
        :disabled="running"
        data-test-id="pkcs12-file"
        @file-upload="selectFile"
      />
      <c-input-text
        v-model:value="password"
        label="PKCS#12 password (ASCII, cleared after every attempt)"
        type="password"
        :maxlength="256"
        raw-text
        data-test-id="pkcs12-password"
      />
    </template>
    <c-input-text
      v-else
      v-model:value="pemSource"
      label="Certificate, CSR, and public-key PEM blocks (maximum 2 MiB)"
      placeholder="-----BEGIN CERTIFICATE-----"
      multiline
      monospace
      raw-text
      :rows="20"
      data-test-id="pem-workspace-source"
    />

    <div class="c-task-actions">
      <c-button type="primary" :disabled="running" data-test-id="pkcs12-pem-run" @click="run">
        {{ running ? 'Processing…' : mode === 'pkcs12' ? 'Inspect PKCS#12 locally' : 'Inspect and normalize PEM' }}
      </c-button>
      <c-button v-if="running" data-test-id="pkcs12-pem-cancel" @click="cancel">
        Cancel
      </c-button>
      <c-button @click="clear">
        Clear local content
      </c-button>
    </div>
    <p class="c-task-status" data-test-id="pkcs12-pem-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="error" title="PKCS#12 / PEM processing error" data-test-id="pkcs12-pem-error">
      {{ error }}
    </c-alert>
    <template v-if="output">
      <c-input-text
        :value="output"
        label="Certificate inventory and normalized public PEM output"
        multiline
        monospace
        raw-text
        readonly
        :rows="24"
        data-test-id="pkcs12-pem-output"
      />
      <div class="c-task-actions">
        <c-button @click="copy()">
          Copy report
        </c-button>
        <c-button @click="downloadTextFile({ content: output, filename: 'pkcs12-pem-report.json' })">
          Download JSON report
        </c-button>
      </div>
    </template>
  </div>
</template>
