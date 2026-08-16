<script setup lang="ts">
import { createDevopsConfigWorkerClient } from './devops-config-workspace.worker-client';
import { DEVOPS_CONFIG_MAX_INPUT_BYTES } from './devops-config-workspace.worker.protocol';
import type { DevopsConfigFormat, DevopsConfigMode } from './devops-config-workspace.service';
import { BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';

const modeOptions: Array<{ label: string; value: DevopsConfigMode }> = [
  { label: 'Dockerfile lint', value: 'dockerfile-lint' },
  { label: 'Compose validate', value: 'compose-normalize' },
  { label: 'nginx format', value: 'nginx-format' },
  { label: 'Properties → YAML', value: 'properties-to-yaml' },
  { label: 'YAML → Properties', value: 'yaml-to-properties' },
  { label: 'JSON/YAML/TOML → .env', value: 'structured-to-env' },
];
const examples: Record<DevopsConfigMode, string> = {
  'dockerfile-lint': 'FROM node:latest\nWORKDIR /app\nCOPY . .\nRUN npm ci\nCMD ["node", "server.js"]',
  'compose-normalize': 'version: "3.8"\nservices:\n  web:\n    image: nginx:1.27\n    ports:\n      - "8080:80"\n',
  'nginx-format': 'server { listen 8080; location / { try_files $uri $uri/ /index.html; } }',
  'properties-to-yaml': 'server.port=8080\nserver.name=demo\nfeature.enabled=true',
  'yaml-to-properties': 'server:\n  port: 8080\n  name: demo\nfeature:\n  enabled: true\n',
  'structured-to-env': 'database:\n  host: localhost\n  password: "local only"\nfeatures:\n  audit: true\n',
};

const mode = ref<DevopsConfigMode>('dockerfile-lint');
const source = ref(examples[mode.value]);
const format = ref<DevopsConfigFormat>('yaml');
const selectedPath = ref('');
const envPrefix = ref('APP');
const output = ref('');
const error = ref('');
const status = ref('Ready.');
const isRunning = ref(false);
const completedSignature = ref('');
const client = createDevopsConfigWorkerClient();
const signature = computed(() => `${mode.value}\0${format.value}\0${selectedPath.value}\0${envPrefix.value}\0${source.value}`);
const stale = computed(() => Boolean(output.value && signature.value !== completedSignature.value));
const inputTooLarge = computed(() => exceedsUtf8ByteLimit(source.value, DEVOPS_CONFIG_MAX_INPUT_BYTES));

watch(mode, () => {
  source.value = examples[mode.value];
  output.value = '';
  error.value = '';
  status.value = 'Example loaded. Select Run.';
});
watch([source, format, selectedPath, envPrefix], () => {
  error.value = '';
  if (!isRunning.value) {
    status.value = stale.value ? 'Input changed. Run to refresh the output.' : 'Ready.';
  }
});

async function run() {
  if (!source.value.trim() || inputTooLarge.value) {
    error.value = inputTooLarge.value ? 'Input is limited to 1 MiB of UTF-8 text.' : 'Enter configuration content.';
    return;
  }
  isRunning.value = true;
  error.value = '';
  status.value = 'Processing locally…';
  const requestedSignature = signature.value;
  try {
    const result = await client.run({ mode: mode.value, source: source.value, format: format.value, path: selectedPath.value, prefix: envPrefix.value });
    output.value = result.value;
    completedSignature.value = requestedSignature;
    status.value = `Completed in ${Math.round(result.elapsedMs)} ms.`;
  }
  catch (caught) {
    const taskError = caught instanceof BoundedTextTaskError ? caught : undefined;
    error.value = taskError?.message ?? 'Configuration processing failed.';
    status.value = taskError?.code === 'cancelled' ? taskError.message : 'Processing failed.';
  }
  finally {
    isRunning.value = false;
  }
}

function cancel() {
  client.cancel('Configuration processing was cancelled.');
}

function download() {
  let extension = 'txt';
  if (mode.value === 'structured-to-env') {
    extension = 'env';
  }
  else if (mode.value === 'properties-to-yaml' || mode.value === 'compose-normalize') {
    extension = 'yml';
  }
  else if (mode.value === 'yaml-to-properties') {
    extension = 'properties';
  }
  downloadTextFile({ content: output.value, filename: `devops-config.${extension}` });
}

const { copy } = useCopy({ source: output, text: 'Configuration output copied to the clipboard' });
onBeforeUnmount(() => client.dispose());
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-card class="c-tool-panel" title="Configuration operation">
      <c-buttons-select v-model:value="mode" :options="modeOptions" label="Operation" label-position="top" />
      <div v-if="mode === 'structured-to-env'" grid grid-cols-1 mt-3 gap-3 md:grid-cols-3>
        <c-select
          v-model:value="format"
          label="Input format"
          :options="[
            { label: 'YAML', value: 'yaml' },
            { label: 'JSON', value: 'json' },
            { label: 'TOML', value: 'toml' },
          ]"
        />
        <c-input-text v-model:value="selectedPath" label="Root JSON Pointer" placeholder="/service or empty for root" raw-text />
        <c-input-text v-model:value="envPrefix" label="Variable prefix" placeholder="APP" :maxlength="128" raw-text />
      </div>
      <p mt-3 text-sm op-70>
        Static local checks never execute configuration, images, commands, includes, or variable expansion. The .env mode emits deterministic POSIX-shell-compatible assignments and never expands source values; dotenv parsers are not standardized, so verify quoting for the target runtime.
      </p>
    </c-card>

    <c-input-text
      v-model:value="source"
      class="c-tool-panel"
      label="Configuration input"
      placeholder="Paste configuration content"
      test-id="devops-config-input"
      raw-text monospace multiline
      :rows="18"
    />

    <div class="c-task-actions">
      <c-button type="primary" :disabled="!source.trim() || inputTooLarge || isRunning" data-test-id="devops-config-run" @click="run">
        {{ isRunning ? 'Processing…' : 'Run' }}
      </c-button>
      <c-button v-if="isRunning" type="warning" data-test-id="devops-config-cancel" @click="cancel">
        Cancel
      </c-button>
    </div>
    <p class="c-task-status" data-test-id="devops-config-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="error" title="Configuration error" data-test-id="devops-config-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="stale" title="Output uses previous input">
      Select Run to process the current content.
    </c-alert>

    <c-input-text
      :value="output"
      class="c-tool-panel"
      label="Result"
      placeholder="Processed output will appear here"
      test-id="devops-config-output"
      raw-text monospace multiline readonly
      :rows="18"
    />
    <div class="c-task-actions">
      <c-button :disabled="!output" data-test-id="devops-config-copy" @click="copy()">
        Copy
      </c-button>
      <c-button :disabled="!output" data-test-id="devops-config-download" @click="download">
        Download
      </c-button>
    </div>
  </div>
</template>
