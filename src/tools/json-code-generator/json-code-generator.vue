<script setup lang="ts">
import type { JsonCodeTarget } from './json-code-generator.service';
import { createJsonCodeWorkerClient } from './json-code-generator.worker-client';
import { JSON_CODE_MAX_INPUT_BYTES } from './json-code-generator.worker.protocol';
import { BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';

const targets: Array<{ label: string; value: JsonCodeTarget }> = [
  { label: 'JSON Schema', value: 'schema' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Size & graph stats', value: 'stats' },
  { label: 'RFC 6902 JSON Patch', value: 'patch' },
];
const source = ref(`{
  // JSON5 examples are accepted
  users: [
    {id: 1, name: 'Ada', active: true},
    {id: 2, name: 'Grace', active: false},
  ],
}`);
const target = ref<JsonCodeTarget>('schema');
const comparison = ref(`{
  "users": [
    { "id": 1, "name": "Ada", "active": true },
    { "id": 2, "name": "Grace", "active": true }
  ],
  "version": 2
}`);
const rootName = ref('ApiResponse');
const output = ref('');
const error = ref('');
const status = ref('Ready.');
const isRunning = ref(false);
const completedSignature = ref('');
const client = createJsonCodeWorkerClient();
const signature = computed(() => `${target.value}\0${rootName.value}\0${source.value}\0${comparison.value}`);
const stale = computed(() => Boolean(output.value && signature.value !== completedSignature.value));
const inputTooLarge = computed(() => exceedsUtf8ByteLimit(source.value, JSON_CODE_MAX_INPUT_BYTES));

watch([source, comparison, target, rootName], () => {
  error.value = '';
  if (!isRunning.value) {
    status.value = stale.value ? 'Input changed. Generate to refresh the output.' : 'Ready.';
  }
});

async function generate() {
  if (!source.value.trim() || inputTooLarge.value) {
    error.value = inputTooLarge.value ? 'Input is limited to 1 MiB of UTF-8 text.' : 'Enter a JSON example.';
    return;
  }
  isRunning.value = true;
  error.value = '';
  status.value = 'Parsing once and generating locally…';
  const requestedSignature = signature.value;
  try {
    const generated = await client.run({ source: source.value, comparison: comparison.value, target: target.value, rootName: rootName.value });
    output.value = generated.value;
    completedSignature.value = requestedSignature;
    status.value = `Completed in ${Math.round(generated.elapsedMs)} ms.`;
  }
  catch (caught) {
    const taskError = caught instanceof BoundedTextTaskError ? caught : undefined;
    error.value = taskError?.message ?? 'JSON generation failed.';
    status.value = taskError?.code === 'cancelled' ? taskError.message : 'Generation failed.';
  }
  finally {
    isRunning.value = false;
  }
}

const { copy } = useCopy({ source: output, text: 'Generated output copied to the clipboard' });
function download() {
  const extension = target.value === 'typescript' ? 'ts' : 'json';
  downloadTextFile({ content: output.value, filename: `generated-json-${target.value}.${extension}` });
}
onBeforeUnmount(() => client.dispose());
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Example-driven inference">
      Schema, TypeScript, and stats targets parse one JSON5 example and use JavaScript number semantics. RFC 6902 Patch instead requires two strict JSON documents, preserves target numeric lexemes, escapes paths as RFC 6901 JSON Pointers, and conservatively emits replace when numerically equal lexemes differ (for example 1 versus 1.0).
    </c-alert>
    <c-card class="c-task-options" title="Output target">
      <c-buttons-select v-model:value="target" :options="targets" label="Generation target" label-position="top" />
      <c-input-text v-if="target === 'schema' || target === 'typescript'" v-model:value="rootName" label="Root type / schema name" :maxlength="128" raw-text mt-3 />
    </c-card>
    <c-input-text v-model:value="source" label="JSON example" test-id="json-code-input" raw-text monospace multiline :rows="18" />
    <c-input-text v-if="target === 'patch'" v-model:value="comparison" label="Desired strict JSON" test-id="json-code-comparison" raw-text monospace multiline :rows="18" />
    <div class="c-task-actions">
      <c-button type="primary" :disabled="!source.trim() || inputTooLarge || isRunning" data-test-id="json-code-run" @click="generate">
        {{ isRunning ? 'Generating…' : 'Generate' }}
      </c-button>
      <c-button v-if="isRunning" type="warning" @click="client.cancel('JSON generation was cancelled.')">
        Cancel
      </c-button>
    </div>
    <p class="c-task-status" data-test-id="json-code-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="error" title="Generation error" data-test-id="json-code-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="stale" title="Output uses previous input">
      Select Generate to process the current example.
    </c-alert>
    <c-input-text :value="output" label="Generated output" test-id="json-code-output" raw-text monospace multiline readonly :rows="18" />
    <div class="c-task-actions">
      <c-button :disabled="!output" @click="copy()">
        Copy
      </c-button>
      <c-button :disabled="!output" @click="download">
        Download
      </c-button>
    </div>
  </div>
</template>
