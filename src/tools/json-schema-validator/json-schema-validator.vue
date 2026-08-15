<script setup lang="ts">
import { JsonSchemaWorkerClient } from './json-schema-validator.worker-client';
import {
  JSON_INSTANCE_MAX_BYTES,
  JSON_SCHEMA_MAX_BYTES,
  JSON_SCHEMA_MAX_ERRORS,
  type JsonSchemaDraft,
  type JsonSchemaValidationResult,
  type JsonSchemaWarning,
  toJsonSchemaTaskError,
} from './json-schema-validator.worker.protocol';

const DEFAULT_DRAFT: JsonSchemaDraft = 'draft2020';
const DEFAULT_SCHEMA = `{
  "type": "object",
  "properties": {
    "name": { "type": "string", "minLength": 1 },
    "age": { "type": "integer", "minimum": 0 }
  },
  "required": ["name"],
  "additionalProperties": false
}`;
const DEFAULT_INSTANCE = `{
  "name": "Ada Lovelace",
  "age": 36
}`;

const draftOptions: Array<{ label: string; value: JsonSchemaDraft }> = [
  { label: 'Draft 2020-12', value: 'draft2020' },
  { label: 'Draft 2019-09', value: 'draft2019' },
  { label: 'Draft 7', value: 'draft7' },
];

const warningMessages: Record<JsonSchemaWarning, string> = {
  'format-not-validated': 'Format keywords are treated as annotations and are not validated.',
  'ieee-754-numbers': 'Decimal or exponent JSON numbers use JavaScript IEEE-754 semantics and may be rounded.',
  'incomplete-error-list': `The error list is incomplete and is capped at ${JSON_SCHEMA_MAX_ERRORS.toLocaleString('en')} entries.`,
};

type ValidationStatus = 'idle' | 'running' | 'valid' | 'invalid' | 'cancelled' | 'timeout' | 'error';

const schemaSource = ref(DEFAULT_SCHEMA);
const instanceSource = ref(DEFAULT_INSTANCE);
const draft = ref<JsonSchemaDraft>(DEFAULT_DRAFT);
const validationResult = shallowRef<JsonSchemaValidationResult>();
const validationState = reactive<{
  status: ValidationStatus
  message: string
  elapsedMs: number
}>({
  status: 'idle',
  message: 'Validation runs only when you select Validate.',
  elapsedMs: 0,
});
const workerClient = new JsonSchemaWorkerClient();

let latestRequestId = 0;
let suppressInputInvalidation = false;

const isRunning = computed(() => validationState.status === 'running');
const statusIsError = computed(() => (
  validationState.status === 'invalid'
  || validationState.status === 'timeout'
  || validationState.status === 'error'
));
const visibleWarnings = computed(() => validationResult.value?.warnings.map(code => ({
  code,
  message: warningMessages[code],
})) ?? []);

function formatElapsedTime(elapsedMs: number): string {
  return elapsedMs < 1_000
    ? `${Math.max(0, Math.round(elapsedMs))} ms`
    : `${(elapsedMs / 1_000).toFixed(2)} s`;
}

function resetValidation(message = 'Validation runs only when you select Validate.'): void {
  validationResult.value = undefined;
  validationState.status = 'idle';
  validationState.message = message;
  validationState.elapsedMs = 0;
}

function invalidateValidation(): void {
  if (suppressInputInvalidation) {
    return;
  }

  const wasRunning = isRunning.value;
  ++latestRequestId;
  workerClient.cancel('JSON Schema validation cancelled because its input or draft changed.');
  validationResult.value = undefined;
  validationState.elapsedMs = 0;

  if (wasRunning) {
    validationState.status = 'cancelled';
    validationState.message = 'Validation cancelled because the input or draft changed.';
    return;
  }

  validationState.status = 'idle';
  validationState.message = 'Input changed. Select Validate to run validation.';
}

async function validate(): Promise<void> {
  const requestedSchema = schemaSource.value;
  const requestedInstance = instanceSource.value;
  const requestedDraft = draft.value;
  const requestId = ++latestRequestId;

  validationResult.value = undefined;
  validationState.status = 'running';
  validationState.message = 'Validating the JSON instance…';
  validationState.elapsedMs = 0;

  try {
    const result = await workerClient.run({
      schemaSource: requestedSchema,
      instanceSource: requestedInstance,
      draft: requestedDraft,
    });

    if (
      requestId !== latestRequestId
      || schemaSource.value !== requestedSchema
      || instanceSource.value !== requestedInstance
      || draft.value !== requestedDraft
    ) {
      return;
    }

    validationResult.value = result.value;
    validationState.elapsedMs = result.elapsedMs;
    if (result.value.valid) {
      validationState.status = 'valid';
      validationState.message = `The JSON instance is valid (${formatElapsedTime(result.elapsedMs)}).`;
      return;
    }

    validationState.status = 'invalid';
    const errorCount = result.value.errors.length;
    validationState.message = `${errorCount.toLocaleString('en')} validation ${errorCount === 1 ? 'error' : 'errors'} found (${formatElapsedTime(result.elapsedMs)}).`;
  }
  catch (error) {
    if (requestId !== latestRequestId) {
      return;
    }

    const taskError = toJsonSchemaTaskError(error);
    validationResult.value = undefined;
    validationState.elapsedMs = taskError.elapsedMs;
    validationState.message = taskError.message;
    validationState.status = taskError.code === 'cancelled'
      ? 'cancelled'
      : taskError.code === 'timeout'
        ? 'timeout'
        : 'error';
  }
}

function cancelValidation(): void {
  if (!isRunning.value) {
    return;
  }

  ++latestRequestId;
  workerClient.cancel('JSON Schema validation cancelled.');
  validationResult.value = undefined;
  validationState.status = 'cancelled';
  validationState.message = 'JSON Schema validation cancelled.';
  validationState.elapsedMs = 0;
}

function clear(): void {
  ++latestRequestId;
  workerClient.cancel('JSON Schema validation cancelled because the inputs were cleared.');
  suppressInputInvalidation = true;
  schemaSource.value = '';
  instanceSource.value = '';
  draft.value = DEFAULT_DRAFT;
  suppressInputInvalidation = false;
  resetValidation('Inputs cleared. Paste a schema and JSON instance, then select Validate.');
}

function displayPath(path: string): string {
  return path || '(root)';
}

watch([schemaSource, instanceSource, draft], invalidateValidation, { flush: 'sync' });

onUnmounted(() => {
  ++latestRequestId;
  workerClient.dispose();
});
</script>

<template>
  <div class="c-task-layout c-tool-workbench">
    <c-card class="c-task-options">
      <div max-w-320px>
        <c-select
          v-model:value="draft"
          label="JSON Schema draft"
          :options="draftOptions"
          data-test-id="json-schema-draft"
        />
      </div>
      <p mt-3 text-sm op-70>
        Validation runs locally in a dedicated worker. Inputs are session-only and are never sent over the network.
      </p>
    </c-card>

    <div class="c-tool-stack">
      <c-input-text
        v-model:value="schemaSource"
        class="c-tool-panel"
        label="JSON Schema"
        placeholder="Paste a JSON Schema here…"
        test-id="json-schema-source"
        :maxlength="JSON_SCHEMA_MAX_BYTES"
        :rows="18"
        raw-text
        multiline
        monospace
      />
      <c-input-text
        v-model:value="instanceSource"
        class="c-tool-panel"
        label="JSON instance"
        placeholder="Paste a JSON instance here…"
        test-id="json-schema-instance"
        :maxlength="JSON_INSTANCE_MAX_BYTES"
        :rows="18"
        raw-text
        multiline
        monospace
      />
    </div>

    <div class="c-task-actions">
      <c-button
        type="primary"
        data-test-id="json-schema-validate"
        :disabled="isRunning"
        @click="validate"
      >
        {{ isRunning ? 'Validating…' : 'Validate' }}
      </c-button>
      <c-button
        v-if="isRunning"
        type="warning"
        data-test-id="json-schema-cancel"
        :disabled="!isRunning"
        @click="cancelValidation"
      >
        Cancel
      </c-button>
      <c-button data-test-id="json-schema-clear" @click="clear">
        Clear
      </c-button>
    </div>

    <p
      data-test-id="json-schema-status"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      class="c-task-status"
      text-sm
      :class="{
        'status-error': statusIsError,
        'status-success': validationState.status === 'valid',
      }"
    >
      {{ validationState.message }}
    </p>

    <div v-if="visibleWarnings.length" data-test-id="json-schema-warning">
      <c-alert title="Validation warnings">
        <ul list-disc pl-5>
          <li v-for="warning in visibleWarnings" :key="warning.code">
            {{ warning.message }}
          </li>
        </ul>
      </c-alert>
    </div>

    <section
      v-if="validationResult && !validationResult.valid"
      class="c-task-results"
      data-test-id="json-schema-errors"
      aria-label="Validation errors"
    >
      <h2 mb-3 text-lg font-600>
        Validation errors
      </h2>
      <p v-if="!validationResult.completeErrorList" mb-3 text-sm op-70>
        Additional validation errors may exist; the bounded error list is incomplete.
      </p>
      <ol flex flex-col gap-3>
        <li
          v-for="(error, index) in validationResult.errors"
          :key="`${error.instancePath}\u0000${error.schemaPath}\u0000${error.keyword}\u0000${index}`"
        >
          <c-card>
            <p font-600>
              {{ displayPath(error.instancePath) }} — {{ error.message }}
            </p>
            <p mt-1 text-sm op-70>
              Line {{ error.line }}, column {{ error.column }} · keyword <code>{{ error.keyword }}</code>
            </p>
            <p mt-1 break-all text-sm op-70>
              Schema path: <code>{{ displayPath(error.schemaPath) }}</code>
            </p>
          </c-card>
        </li>
      </ol>
    </section>
  </div>
</template>

<style lang="less" scoped>
.status-error {
  color: var(--n-feedback-text-color-error, #d03050);
}

.status-success {
  color: #18a058;
}
</style>
