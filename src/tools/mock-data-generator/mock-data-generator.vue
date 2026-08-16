<script setup lang="ts">
import {
  MOCK_DATASET_VERSION,
  MOCK_DATA_MAX_RECORDS,
  MOCK_DATA_MAX_SEED_BYTES,
  type MockDataFormat,
  type MockDataOptions,
  type MockDataProfile,
  parseMockRecordCount,
  validateMockDataOptions,
} from './mock-data-generator.service';
import { createMockDataWorkerClient } from './mock-data-generator.worker-client';
import { BoundedTextTaskError } from '@/utils/bounded-text-task';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';

const profileOptions: Array<{ label: string; value: MockDataProfile }> = [
  { label: 'Full profile', value: 'full' },
  { label: 'Person', value: 'person' },
  { label: 'Address', value: 'address' },
  { label: 'Dates and timestamps', value: 'dates' },
  { label: 'Internet', value: 'internet' },
  { label: 'Identifiers', value: 'identifiers' },
];
const formatOptions: Array<{ label: string; value: MockDataFormat }> = [
  { label: 'JSON', value: 'json' },
  { label: 'CSV', value: 'csv' },
];

const seed = ref('it-tools-demo');
const countInput = ref('25');
const profile = ref<MockDataProfile>('full');
const format = ref<MockDataFormat>('json');
const output = ref('');
const error = ref('');
const status = ref('Ready.');
const isRunning = ref(false);
const generatedSignature = ref('');
const client = createMockDataWorkerClient();

const options = computed<MockDataOptions>(() => ({
  seed: seed.value,
  count: parseMockRecordCount(countInput.value),
  profile: profile.value,
  format: format.value,
}));
const validationMessage = computed(() => validateMockDataOptions(options.value));
const signature = computed(() => JSON.stringify(options.value));
const outputIsStale = computed(() => Boolean(output.value && generatedSignature.value !== signature.value));

watch([seed, countInput, profile, format], () => {
  error.value = '';
  if (!isRunning.value) {
    status.value = outputIsStale.value ? 'Settings changed. Generate to refresh the output.' : 'Ready.';
  }
});

async function generate() {
  if (validationMessage.value) {
    error.value = validationMessage.value;
    status.value = 'Check the highlighted configuration.';
    return;
  }

  error.value = '';
  isRunning.value = true;
  status.value = 'Generating locally…';
  const requestedSignature = signature.value;
  try {
    const result = await client.run(options.value);
    output.value = result.value;
    generatedSignature.value = requestedSignature;
    status.value = `Generated ${options.value.count.toLocaleString('en-US')} records in ${Math.round(result.elapsedMs)} ms.`;
  }
  catch (caught) {
    if (caught instanceof BoundedTextTaskError && caught.code === 'cancelled') {
      status.value = caught.message;
    }
    else {
      error.value = caught instanceof Error ? caught.message : 'Mock data could not be generated.';
      status.value = 'Generation failed.';
    }
  }
  finally {
    isRunning.value = false;
  }
}

function cancel() {
  client.cancel('Mock-data generation was cancelled.');
}

function clear() {
  output.value = '';
  generatedSignature.value = '';
  error.value = '';
  status.value = 'Ready.';
}

function download() {
  downloadTextFile({
    content: output.value,
    filename: `mock-data.${format.value}`,
  });
}

const { copy } = useCopy({ source: output, text: 'Mock data copied to the clipboard' });

onBeforeUnmount(() => client.dispose());
</script>

<template>
  <div class="c-generator-layout">
    <c-card class="c-generator-options" title="Dataset options">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-select
          v-model:value="profile"
          label="Data profile"
          label-position="top"
          :options="profileOptions"
        />
        <c-buttons-select
          v-model:value="format"
          label="Output format"
          label-position="top"
          :options="formatOptions"
        />
        <c-input-text
          v-model:value="seed"
          label="Deterministic seed"
          :maxlength="MOCK_DATA_MAX_SEED_BYTES"
          test-id="mock-data-seed"
          raw-text
          clearable
        />
        <c-input-text
          v-model:value="countInput"
          :label="`Records (1–${MOCK_DATA_MAX_RECORDS.toLocaleString('en-US')})`"
          :maxlength="String(MOCK_DATA_MAX_RECORDS).length"
          test-id="mock-data-count"
          inputmode="numeric"
          raw-text
        />
      </div>

      <p mt-3 text-sm op-70>
        English dataset {{ MOCK_DATASET_VERSION }}. The same seed and options always reproduce the same output.
        Generated content stays in this tab unless you copy or download it.
      </p>

      <c-alert v-if="validationMessage || error" title="Invalid configuration" mt-3 data-test-id="mock-data-error">
        {{ error || validationMessage }}
      </c-alert>
    </c-card>

    <c-alert v-if="outputIsStale" title="Output uses previous settings" data-test-id="mock-data-stale">
      Select Generate to apply the current settings. Existing output remains available until then.
    </c-alert>

    <c-input-text
      class="c-generator-output"
      :value="output"
      aria-label="Generated mock data"
      placeholder="Generated mock data will appear here"
      test-id="mock-data-output"

      raw-text readonly monospace multiline
      :rows="18"
    />

    <p class="c-task-status" data-test-id="mock-data-status" role="status" aria-live="polite">
      {{ status }}
    </p>

    <div class="c-generator-actions">
      <c-button type="primary" :disabled="Boolean(validationMessage) || isRunning" data-test-id="mock-data-generate" @click="generate">
        {{ isRunning ? 'Generating…' : 'Generate' }}
      </c-button>
      <c-button v-if="isRunning" type="warning" data-test-id="mock-data-cancel" @click="cancel">
        Cancel
      </c-button>
      <c-button :disabled="!output" data-test-id="mock-data-copy" @click="copy()">
        Copy
      </c-button>
      <c-button :disabled="!output" data-test-id="mock-data-download" @click="download">
        Download
      </c-button>
      <c-button :disabled="!output" data-test-id="mock-data-clear" @click="clear">
        Clear
      </c-button>
    </div>
  </div>
</template>
