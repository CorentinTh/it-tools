<script setup lang="ts">
import { createOpenApiWorkerClient } from './openapi-inspector.worker-client';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';

const source = ref(`openapi: 3.1.0
info:
  title: Pet API
  version: 1.0.0
servers:
  - url: https://api.example.com
paths:
  /pets/{petId}:
    get:
      operationId: getPet
      summary: Get one pet
      parameters:
        - name: petId
          in: path
          required: true
          schema:
            type: string
            example: pet-123
      responses:
        '200':
          description: Pet details
  /pets:
    post:
      operationId: createPet
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name: { type: string, example: Luna }
                age: { type: integer, minimum: 0 }
      responses:
        '201': { description: Created }
`);
const output = ref('');
const status = ref('Ready. Inspection runs only after the explicit action.');
const error = ref('');
const isRunning = ref(false);
const client = createOpenApiWorkerClient();
const { copy } = useCopy({ source: output, text: 'OpenAPI report copied' });

async function inspect() {
  isRunning.value = true;
  error.value = '';
  status.value = 'Inspecting locally in a disposable worker…';
  try {
    const result = await client.run({ source: source.value });
    output.value = result.value;
    status.value = `Inspection finished locally in ${Math.round(result.elapsedMs)} ms.`;
  }
  catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'OpenAPI inspection failed.';
    status.value = 'Inspection failed.';
  }
  finally {
    isRunning.value = false;
  }
}

function cancel() {
  client.cancel('OpenAPI inspection cancelled.');
  isRunning.value = false;
  status.value = 'OpenAPI inspection cancelled.';
}

function clear() {
  client.cancel();
  source.value = '';
  output.value = '';
  error.value = '';
  isRunning.value = false;
  status.value = 'OpenAPI content cleared.';
}

onBeforeUnmount(() => {
  client.dispose();
  source.value = '';
  output.value = '';
});
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Local structural inspection — not a full conformance validator">
      Parses bounded OpenAPI 3.0/3.1 JSON or YAML, lists operations, resolves local references, and creates illustrative curl requests and mock JSON payloads. External $ref, URLs, and server calls are never fetched. Generated examples are not production test data and the checks do not replace an OpenAPI conformance validator.
    </c-alert>
    <c-input-text
      v-model:value="source"
      label="OpenAPI JSON or YAML (maximum 1 MiB)"
      multiline
      monospace
      raw-text
      :rows="20"
      data-test-id="openapi-source"
    />
    <div class="c-task-actions">
      <c-button type="primary" :disabled="isRunning" data-test-id="openapi-inspect" @click="inspect">
        {{ isRunning ? 'Inspecting…' : 'Inspect OpenAPI document' }}
      </c-button>
      <c-button v-if="isRunning" data-test-id="openapi-cancel" @click="cancel">
        Cancel
      </c-button>
      <c-button @click="clear">
        Clear local content
      </c-button>
    </div>
    <p class="c-task-status" data-test-id="openapi-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="error" title="OpenAPI inspection error" data-test-id="openapi-error">
      {{ error }}
    </c-alert>
    <template v-if="output">
      <c-input-text
        :value="output"
        label="Endpoint, request, and mock payload report"
        multiline
        monospace
        raw-text
        readonly
        :rows="24"
        data-test-id="openapi-output"
      />
      <div class="c-task-actions">
        <c-button @click="copy()">
          Copy report
        </c-button>
        <c-button @click="downloadTextFile({ content: output, filename: 'openapi-inspection.txt' })">
          Download report
        </c-button>
      </div>
    </template>
  </div>
</template>
