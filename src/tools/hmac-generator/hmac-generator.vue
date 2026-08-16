<script setup lang="ts">
import { HMAC_ALGORITHMS, HMAC_KEY_ENCODINGS, HMAC_OUTPUT_ENCODINGS, type HmacAlgorithm, type HmacKeyEncoding, type HmacOutputEncoding } from './hmac-generator.service';
import { createHmacWorkerClient } from './hmac-generator.worker-client';
import { HMAC_MAX_KEY_INPUT_BYTES, HMAC_MAX_MESSAGE_BYTES } from './hmac-generator.worker.protocol';
import { BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { useCopy } from '@/composable/copy';

const message = ref('');
const key = ref('');
const algorithm = ref<HmacAlgorithm>('SHA256');
const keyEncoding = ref<HmacKeyEncoding>('text');
const outputEncoding = ref<HmacOutputEncoding>('Hex');
const output = ref('');
const error = ref('');
const status = ref('Ready.');
const isRunning = ref(false);
const client = createHmacWorkerClient();
const tooLarge = computed(() => exceedsUtf8ByteLimit(message.value, HMAC_MAX_MESSAGE_BYTES) || exceedsUtf8ByteLimit(key.value, HMAC_MAX_KEY_INPUT_BYTES));

async function run() {
  if (tooLarge.value) {
    error.value = 'Message or encoded key exceeds the local input limit.';
    return;
  }
  isRunning.value = true;
  error.value = '';
  status.value = 'Computing locally…';
  try {
    const result = await client.run({ message: message.value, key: key.value, algorithm: algorithm.value, keyEncoding: keyEncoding.value, outputEncoding: outputEncoding.value });
    output.value = result.value;
    status.value = `Completed in ${Math.round(result.elapsedMs)} ms.`;
  }
  catch (caught) {
    error.value = caught instanceof BoundedTextTaskError ? caught.message : 'HMAC computation failed.';
    status.value = 'Computation failed.';
  }
  finally {
    isRunning.value = false;
  }
}

const { copy } = useCopy({ source: output, text: 'HMAC copied to the clipboard' });
onBeforeUnmount(() => client.dispose());
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-alert title="Explicit byte representations">
      Message text is UTF-8. The key is decoded exactly as UTF-8 text, complete hex byte pairs, or canonical padded RFC 4648 Base64. Values stay in this session. SHA-1, MD5, RIPEMD-160, and CryptoJS's legacy SHA3/Keccak compatibility mode should not be selected for new protocols.
    </c-alert>
    <c-input-text v-model:value="message" label="Message (UTF-8)" placeholder="Text to authenticate" test-id="hmac-message" rows="12" multiline raw-text monospace />
    <c-card class="c-task-options" title="HMAC options">
      <div grid grid-cols-1 gap-3 md:grid-cols-3>
        <c-select v-model:value="algorithm" label="Algorithm" :options="HMAC_ALGORITHMS.map(value => ({ label: value, value }))" />
        <c-select v-model:value="keyEncoding" label="Key representation" :options="HMAC_KEY_ENCODINGS.map(value => ({ label: value === 'text' ? 'UTF-8 text' : value.toUpperCase(), value }))" />
        <c-select v-model:value="outputEncoding" label="Output encoding" :options="HMAC_OUTPUT_ENCODINGS.map(value => ({ label: value, value }))" />
      </div>
      <c-input-text v-model:value="key" label="Secret key" placeholder="Enter the key in the selected representation" test-id="hmac-key" raw-text clearable mt-3 />
    </c-card>
    <div class="c-task-actions">
      <c-button type="primary" :disabled="tooLarge || isRunning" data-test-id="hmac-run" @click="run">
        {{ isRunning ? 'Computing…' : 'Compute HMAC' }}
      </c-button>
      <c-button v-if="isRunning" type="warning" @click="client.cancel('HMAC computation was cancelled.')">
        Cancel
      </c-button>
    </div>
    <p class="c-task-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="error" title="HMAC error">
      {{ error }}
    </c-alert>
    <c-input-text :value="output" label="HMAC" test-id="hmac-output" rows="5" multiline raw-text monospace readonly />
    <div class="c-task-actions">
      <c-button :disabled="!output" @click="copy()">
        Copy HMAC
      </c-button>
      <c-button :disabled="!output" @click="output = ''">
        Clear result
      </c-button>
    </div>
  </div>
</template>
