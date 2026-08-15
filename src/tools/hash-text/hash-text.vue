<script setup lang="ts">
import InputCopyable from '../../components/InputCopyable.vue';
import { createHashTextWorkerClient } from './hash-text.worker-client';
import {
  HASH_TEXT_ALGORITHMS,
  HASH_TEXT_LIVE_MAX_BYTES,
  HASH_TEXT_MAX_INPUT_BYTES,
  type HashTextDigests,
  type HashTextEncoding,
  parseHashTextDigestPayload,
} from './hash-text.worker.protocol';
import { useBoundedTextTransform } from '@/composable/bounded-text-transform';
import { useQueryParam } from '@/composable/queryParams';

const encoding = useQueryParam<HashTextEncoding>({ defaultValue: 'Hex', name: 'encoding' });
const clearText = ref('');
const client = createHashTextWorkerClient();
const {
  cancel,
  hasError,
  isRunning,
  output,
  run,
  state,
} = useBoundedTextTransform({
  allowEmptySource: true,
  client,
  createTask: () => ({ encoding: encoding.value, source: clearText.value }),
  debounceMs: 250,
  label: 'Text hashing',
  liveMaxBytes: HASH_TEXT_LIVE_MAX_BYTES,
  maxInputBytes: HASH_TEXT_MAX_INPUT_BYTES,
  source: clearText,
  watchSources: [clearText, encoding],
});

const emptyDigests = Object.fromEntries(HASH_TEXT_ALGORITHMS.map(algorithm => [algorithm, ''])) as HashTextDigests;
const digests = computed(() => parseHashTextDigestPayload(output.value) ?? emptyDigests);
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-card title="Input" class="c-tool-panel">
      <c-input-text
        v-model:value="clearText"
        label="Text to hash"
        placeholder="Your string to hash..."
        rows="8"
        raw-text autofocus multiline monospace
        test-id="hash-text-input"
      />

      <c-select
        v-model:value="encoding"
        class="mt-4"
        label="Digest encoding"
        :options="[
          { label: 'Binary (base 2)', value: 'Bin' },
          { label: 'Hexadecimal (base 16)', value: 'Hex' },
          { label: 'Base64 (base 64)', value: 'Base64' },
          { label: 'Base64url (base 64 with URL-safe chars)', value: 'Base64url' },
        ]"
      />
    </c-card>

    <div class="c-task-actions">
      <c-button type="primary" data-test-id="hash-text-run" :disabled="isRunning" @click="run">
        {{ isRunning ? 'Hashing…' : 'Run text hashing' }}
      </c-button>
      <c-button v-if="isRunning" type="warning" data-test-id="hash-text-cancel" @click="cancel">
        Cancel
      </c-button>
    </div>
    <p
      v-if="state.message"
      data-test-id="hash-text-status"
      role="status"
      aria-live="polite"
      :class="{ 'status-error': hasError }"
    >
      {{ state.message }}
    </p>

    <c-alert type="warning" title="Legacy digests">
      MD5 and SHA-1 are retained for compatibility checks only. Do not use them for security-sensitive designs.
    </c-alert>

    <c-card title="Digests" class="c-tool-panel">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <InputCopyable
          v-for="algorithm in HASH_TEXT_ALGORITHMS"
          :key="algorithm"
          :value="digests[algorithm]"
          :label="algorithm"

          monospace readonly
        />
      </div>
    </c-card>
  </div>
</template>

<style scoped>
.status-error {
  color: var(--n-feedback-text-color-error);
}
</style>
