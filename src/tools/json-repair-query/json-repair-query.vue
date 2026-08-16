<script setup lang="ts">
import type { JsonWorkspaceOperation } from './json-repair-query.service';
import { createJsonWorkspaceWorkerClient } from './json-repair-query.worker-client';
import { JSON_WORKSPACE_MAX_INPUT_BYTES } from './json-repair-query.worker.protocol';
import { BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';

const operations: Array<{ label: string; value: JsonWorkspaceOperation }> = [
  { label: 'Repair JSON', value: 'repair' },
  { label: 'Query JSON', value: 'query' },
  { label: 'Unescape JSON string', value: 'unescape' },
];
const examples: Record<JsonWorkspaceOperation, string> = {
  repair: '{\n  // JSON5-style input\n  users: [{name: \'Ada\'}, {name: \'Grace\'},],\n}',
  query: '{\n  "users": [\n    {"name": "Ada", "active": true},\n    {"name": "Grace", "active": false}\n  ]\n}',
  unescape: '"{\\n  \\"message\\": \\"Copied from a log\\",\\n  \\"ok\\": true\\n}"',
};
const operation = ref<JsonWorkspaceOperation>('repair');
const source = ref(examples.repair);
const query = ref('$.users[*].name');
const output = ref('');
const error = ref('');
const status = ref('Ready.');
const isRunning = ref(false);
const completedSignature = ref('');
const client = createJsonWorkspaceWorkerClient();
const signature = computed(() => `${operation.value}\0${query.value}\0${source.value}`);
const stale = computed(() => Boolean(output.value && signature.value !== completedSignature.value));
const inputTooLarge = computed(() => exceedsUtf8ByteLimit(source.value, JSON_WORKSPACE_MAX_INPUT_BYTES));

watch(operation, () => {
  source.value = examples[operation.value];
  output.value = '';
  error.value = '';
  status.value = 'Example loaded. Select Run.';
});
watch([source, query], () => {
  error.value = '';
  if (!isRunning.value) {
    status.value = stale.value ? 'Input changed. Run to refresh the output.' : 'Ready.';
  }
});

async function run() {
  if (!source.value.trim() || inputTooLarge.value || (operation.value === 'query' && !query.value.trim())) {
    error.value = inputTooLarge.value ? 'Input is limited to 1 MiB of UTF-8 text.' : 'Enter JSON and a query when required.';
    return;
  }
  isRunning.value = true;
  error.value = '';
  status.value = operation.value === 'repair'
    ? 'Repairing locally…'
    : operation.value === 'query' ? 'Querying locally…' : 'Unescaping locally…';
  const requestedSignature = signature.value;
  try {
    const result = await client.run({ operation: operation.value, query: query.value, source: source.value });
    output.value = result.value;
    completedSignature.value = requestedSignature;
    status.value = `Completed in ${Math.round(result.elapsedMs)} ms.`;
  }
  catch (caught) {
    const taskError = caught instanceof BoundedTextTaskError ? caught : undefined;
    error.value = taskError?.message ?? 'JSON processing failed.';
    status.value = taskError?.code === 'cancelled' ? taskError.message : 'Processing failed.';
  }
  finally {
    isRunning.value = false;
  }
}

const { copy } = useCopy({ source: output, text: 'JSON output copied to the clipboard' });
function download() {
  const filename = operation.value === 'repair' ? 'repaired.json' : operation.value === 'query' ? 'query-result.json' : 'unescaped.json';
  downloadTextFile({ content: output.value, filename });
}
onBeforeUnmount(() => client.dispose());
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-card class="c-tool-panel" title="Operation">
      <c-buttons-select v-model:value="operation" :options="operations" label="JSON operation" label-position="top" />
      <c-input-text
        v-if="operation === 'query'"
        v-model:value="query"
        label="Safe JSONPath"
        placeholder="$.users[*].name"
        test-id="json-workspace-query"
        raw-text monospace
        mt-3
      />
      <p mt-3 text-sm op-70>
        <template v-if="operation === 'repair'">
          Repair accepts JSON5 comments, trailing commas, single quotes, and unquoted keys. It uses JavaScript number semantics, so integers beyond the safe range are not lossless.
        </template>
        <template v-else-if="operation === 'query'">
          Queries accept only $, property names, quoted keys, numeric indexes, and * wildcards. Filters, recursive descent, scripts, functions, and JavaScript execution are intentionally unsupported.
        </template>
        <template v-else>
          Unescape accepts exactly one valid outer JSON string whose decoded text is itself strict JSON. It returns the decoded text unchanged and never reinterprets ordinary JSON automatically.
        </template>
      </p>
    </c-card>

    <c-input-text v-model:value="source" class="c-tool-panel" label="JSON input" test-id="json-workspace-input" raw-text monospace multiline :rows="18" />
    <div class="c-task-actions">
      <c-button type="primary" :disabled="!source.trim() || inputTooLarge || isRunning" data-test-id="json-workspace-run" @click="run">
        {{ isRunning ? 'Processing…' : 'Run' }}
      </c-button>
      <c-button v-if="isRunning" type="warning" @click="client.cancel('JSON processing was cancelled.')">
        Cancel
      </c-button>
    </div>
    <p class="c-task-status" data-test-id="json-workspace-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="error" title="JSON error" data-test-id="json-workspace-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="stale" title="Output uses previous input">
      Select Run to process the current content.
    </c-alert>

    <c-input-text :value="output" class="c-tool-panel" label="JSON output" test-id="json-workspace-output" raw-text monospace multiline readonly :rows="18" />
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
