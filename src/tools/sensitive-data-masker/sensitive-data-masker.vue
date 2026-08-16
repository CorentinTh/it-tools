<script setup lang="ts">
import type { SanitizerMode } from './sensitive-data-masker.service';
import { createSanitizerWorkerClient } from './sensitive-data-masker.worker-client';
import { SANITIZER_MAX_INPUT_BYTES } from './sensitive-data-masker.worker.protocol';
import CInputText from '@/ui/c-input-text/c-input-text.vue';
import CSwitch from '@/ui/c-switch/c-switch.vue';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { BoundedTextTaskError } from '@/utils/bounded-text-task';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';

const modeOptions: Array<{ label: string; value: SanitizerMode }> = [
  { label: 'Auto detect', value: 'auto' },
  { label: 'Plain text', value: 'text' },
  { label: 'JSON', value: 'json' },
  { label: 'HAR', value: 'har' },
];
const source = ref(`{
  "request": {
    "url": "https://api.example.test/users?access_token=secret-token",
    "headers": [{ "name": "Authorization", "value": "Bearer eyJhbGciOi.secret.signature" }],
    "email": "ada@example.test",
    "password": "correct-horse-battery-staple"
  }
}`);
const mode = ref<SanitizerMode>('auto');
const maskEmails = ref(true);
const maskIpAddresses = ref(false);
const output = ref('');
const status = ref('Ready.');
const error = ref('');
const isRunning = ref(false);
const processedSignature = ref('');
const inputElement = ref<typeof CInputText>();
const client = createSanitizerWorkerClient();

const signature = computed(() => `${mode.value}\0${maskEmails.value}\0${maskIpAddresses.value}\0${source.value}`);
const isStale = computed(() => Boolean(output.value && processedSignature.value !== signature.value));
const inputTooLarge = computed(() => exceedsUtf8ByteLimit(source.value, SANITIZER_MAX_INPUT_BYTES));

watch([source, mode, maskEmails, maskIpAddresses], () => {
  error.value = '';
  if (!isRunning.value) {
    status.value = isStale.value ? 'Settings or input changed. Sanitize to refresh the output.' : 'Ready.';
  }
});

async function sanitize() {
  if (source.value.trim() === '' || inputTooLarge.value) {
    error.value = inputTooLarge.value
      ? `Input is limited to ${SANITIZER_MAX_INPUT_BYTES.toLocaleString('en-US')} UTF-8 bytes.`
      : 'Enter content to sanitize.';
    return;
  }
  error.value = '';
  isRunning.value = true;
  status.value = 'Sanitizing locally…';
  const requestedSignature = signature.value;
  try {
    const result = await client.run({
      source: source.value,
      mode: mode.value,
      maskEmails: maskEmails.value,
      maskIpAddresses: maskIpAddresses.value,
    });
    output.value = result.value;
    processedSignature.value = requestedSignature;
    status.value = `Sanitization completed in ${Math.round(result.elapsedMs)} ms.`;
  }
  catch (caught) {
    const taskError = caught instanceof BoundedTextTaskError ? caught : undefined;
    error.value = taskError?.message ?? 'The content could not be sanitized.';
    status.value = taskError?.code === 'cancelled' ? taskError.message : 'Sanitization failed.';
  }
  finally {
    isRunning.value = false;
  }
}

function cancel() {
  client.cancel('Sanitization was cancelled.');
}

function download() {
  const extension = mode.value === 'har' ? 'har' : mode.value === 'text' ? 'txt' : 'json';
  downloadTextFile({ content: output.value, filename: `sanitized.${extension}` });
}

const { copy } = useCopy({ source: output, text: 'Sanitized content copied to the clipboard' });
onBeforeUnmount(() => client.dispose());
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-card class="c-tool-panel" title="Sanitizer options">
      <c-buttons-select
        v-model:value="mode"
        label="Input format"
        label-position="top"
        :options="modeOptions"
      />
      <div grid grid-cols-1 mt-3 gap-3 md:grid-cols-2>
        <CSwitch v-model:value="maskEmails" label="Mask email addresses" test-id="sanitizer-mask-emails" />
        <CSwitch v-model:value="maskIpAddresses" label="Mask IPv4 addresses" test-id="sanitizer-mask-ips" />
      </div>
      <p mt-3 text-sm op-70>
        Passwords, tokens, authorization/cookie headers, private keys, sensitive URL parameters, and selected PII are replaced locally. Always review the result before sharing it.
      </p>
    </c-card>

    <CInputText
      ref="inputElement"
      v-model:value="source"
      class="c-tool-panel"
      label="Sensitive input"
      placeholder="Paste text, JSON, or an exported HAR document"
      test-id="sanitizer-input"
      raw-text
      monospace
      multiline
      :rows="18"
    />

    <div class="c-task-actions">
      <c-button type="primary" :disabled="source.trim() === '' || inputTooLarge || isRunning" data-test-id="sanitizer-run" @click="sanitize">
        {{ isRunning ? 'Sanitizing…' : 'Sanitize' }}
      </c-button>
      <c-button v-if="isRunning" type="warning" data-test-id="sanitizer-cancel" @click="cancel">
        Cancel
      </c-button>
    </div>
    <p class="c-task-status" data-test-id="sanitizer-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="error" title="Sanitization error" data-test-id="sanitizer-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="isStale" title="Output uses previous input" data-test-id="sanitizer-stale">
      Select Sanitize to process the current content.
    </c-alert>

    <CInputText
      class="c-tool-panel"
      :value="output"
      label="Sanitized output"
      aria-label="Sanitized output"
      placeholder="Sanitized content will appear here"
      test-id="sanitizer-output"
      raw-text
      monospace
      readonly
      multiline
      :rows="18"
    />
    <div class="c-task-actions">
      <c-button :disabled="!output" data-test-id="sanitizer-copy" @click="copy()">
        Copy
      </c-button>
      <c-button :disabled="!output" data-test-id="sanitizer-download" @click="download">
        Download
      </c-button>
    </div>
  </div>
</template>
