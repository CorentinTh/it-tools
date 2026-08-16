<script setup lang="ts">
import type { HttpCodeTarget } from './http-request-code-builder.service';
import { HTTP_BUILDER_MAX_TEXT_BYTES, buildHttpRequestCode, importCurlCommand } from './http-request-code-builder.service';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';

type Mode = 'author' | 'import';
const mode = ref<Mode>('author');
const target = ref<HttpCodeTarget>('curl');
const method = ref('POST');
const url = ref('https://api.example.test/v1/items');
const headers = ref('Accept: application/json\nContent-Type: application/json\nAuthorization: Bearer replace-me');
const query = ref('limit=20\ntag=demo');
const body = ref('{\n  "name": "example"\n}');
const revealSecrets = ref(false);
const curlSource = ref('curl --request POST --url \'https://api.example.test/v1/items\' --header \'Content-Type: application/json\' --data-raw \'{"name":"example"}\'');
const output = ref('');
const error = ref('');
const status = ref('Ready. No request will be sent.');
const importWarnings = ref<string[]>([]);
const completedSignature = ref('');
const signature = computed(() => [method.value, url.value, headers.value, query.value, body.value, target.value, revealSecrets.value].join('\0'));
const stale = computed(() => Boolean(output.value && completedSignature.value !== signature.value));
const { copy } = useCopy({ source: output, text: 'Request code copied' });

function build() {
  try {
    output.value = buildHttpRequestCode({ method: method.value, url: url.value, headers: headers.value, query: query.value, body: body.value, target: target.value, revealSecrets: revealSecrets.value });
    completedSignature.value = signature.value;
    error.value = '';
    status.value = revealSecrets.value ? 'Generated locally with entered secret values visible.' : 'Generated locally with sensitive header/query values redacted.';
  }
  catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'Request code generation failed.';
    status.value = 'Generation failed.';
  }
}

function importCurl() {
  try {
    const imported = importCurlCommand(curlSource.value);
    method.value = imported.method;
    url.value = imported.url;
    headers.value = imported.headers;
    query.value = imported.query;
    body.value = imported.body;
    importWarnings.value = imported.warnings;
    output.value = '';
    completedSignature.value = '';
    error.value = '';
    mode.value = 'author';
    status.value = 'Imported the supported cURL subset. Review fields, then generate code.';
  }
  catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'cURL import failed.';
    status.value = 'Import failed.';
  }
}
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Authoring only — no network request">
      This tool generates text and never executes cURL, fetch, shell commands, or HTTP requests. Duplicate headers and query fields are preserved. Authorization, cookie, token, key, secret, password, and signature fields are redacted by default in headers, query fields, and recognized JSON/form bodies; review other unstructured bodies manually.
    </c-alert>
    <c-card class="c-task-options" title="Workflow">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-select v-model:value="mode" label="Workflow" :options="[{ label: 'Author request', value: 'author' }, { label: 'Import supported cURL', value: 'import' }]" />
        <c-select v-if="mode === 'author'" v-model:value="target" label="Generated format" :options="[{ label: 'POSIX cURL', value: 'curl' }, { label: 'JavaScript fetch', value: 'fetch' }]" />
      </div>
    </c-card>

    <template v-if="mode === 'author'">
      <c-card title="Request fields">
        <div grid grid-cols-1 gap-3 md:grid-cols="minmax(10rem,0.25fr) minmax(0,1fr)">
          <c-select v-model:value="method" label="HTTP method" :options="['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map(value => ({ label: value, value }))" />
          <c-input-text v-model:value="url" label="Absolute HTTP(S) URL" test-id="http-builder-url" raw-text monospace />
        </div>
      </c-card>
      <c-input-text v-model:value="headers" label="Headers — one Name: value per line" raw-text monospace multiline :rows="8" />
      <c-input-text v-model:value="query" label="Additional query fields — one name=value per line" raw-text monospace multiline :rows="6" />
      <c-input-text v-model:value="body" label="Request body" raw-text monospace multiline :rows="10" />
      <c-switch v-model:value="revealSecrets" label="Include entered sensitive values in generated code" />
      <c-alert v-if="importWarnings.length" title="Imported options omitted">
        <ul m-0 pl-5>
          <li v-for="warning in importWarnings" :key="warning">
            {{ warning }}
          </li>
        </ul>
      </c-alert>
      <div class="c-task-actions">
        <c-button type="primary" data-test-id="http-builder-build" @click="build">
          Generate code
        </c-button>
      </div>
    </template>
    <template v-else>
      <c-input-text v-model:value="curlSource" label="POSIX cURL command" test-id="http-builder-curl-input" :maxlength="HTTP_BUILDER_MAX_TEXT_BYTES" raw-text monospace multiline :rows="14" />
      <div class="c-task-actions">
        <c-button type="primary" data-test-id="http-builder-import" @click="importCurl">
          Import without executing
        </c-button>
      </div>
    </template>

    <p class="c-task-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="error" title="Request builder error" data-test-id="http-builder-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="stale" title="Output uses previous fields">
      Generate again to apply the current request fields and redaction choice.
    </c-alert>
    <c-input-text :value="output" label="Generated request code" data-test-id="http-builder-output" raw-text monospace multiline readonly :rows="18" />
    <div class="c-task-actions">
      <c-button :disabled="!output" @click="copy()">
        Copy
      </c-button>
      <c-button :disabled="!output" @click="downloadTextFile({ content: output, filename: target === 'curl' ? 'request.sh' : 'request.js' })">
        Download
      </c-button>
    </div>
  </div>
</template>
