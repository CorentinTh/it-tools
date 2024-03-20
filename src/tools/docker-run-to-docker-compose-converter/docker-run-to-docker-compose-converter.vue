<script setup lang="ts">
import composerize from 'composerize';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { textToBase64 } from '@/utils/base64';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const dockerRuns = ref(
  'docker run -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock:ro --restart always --log-opt max-size=1g nginx',
);
const indentSize = useStorage('docker-run-to-compose:indent-size', 4);

const existingDockerComposeFile = ref(
  '',
);
const format = useStorage('docker-run-to-compose:format', 'latest');
const formatOptions = [
  { value: 'v2x', label: 'V2 - 2.x' },
  { value: 'v3x', label: 'V2 - 3.x' },
  { value: 'latest', label: 'CommonSpec' },
];

const conversionResult = computed(() => {
  try {
    return { yaml: composerize(dockerRuns.value.trim(), existingDockerComposeFile.value, format.value, indentSize.value), errors: [] };
  }
  catch (e: any) {
    return { yaml: '#see error messages', errors: e.toString().split('\n') };
  }
});

const dockerCompose = computed(() => conversionResult.value.yaml);
const errors = computed(() => conversionResult.value.errors);

const dockerComposeBase64 = computed(() => `data:application/yaml;base64,${textToBase64(dockerCompose.value)}`);
const { download } = useDownloadFileFromBase64({ source: dockerComposeBase64, filename: 'docker-compose.yml' });

const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
};
</script>

<template>
  <div>
    <c-input-text
      v-model:value="dockerRuns"
      label="Your docker run command(s):"
      style="font-family: monospace"
      multiline
      raw-text
      monospace
      placeholder="Your docker run command(s) to convert..."
      rows="4"
    />

    <n-divider />

    <c-label label="Eventually, paste your existing Docker Compose:">
      <div relative w-full>
        <c-monaco-editor
          v-model:value="existingDockerComposeFile"
          theme="vs-dark"
          language="yaml"
          height="100px"
          :options="MONACO_EDITOR_OPTIONS"
        />
      </div>
    </c-label>

    <n-divider />

    <n-grid cols="4" x-gap="12" w-full>
      <n-gi span="2">
        <c-select
          v-model:value="format"
          label-position="top"
          label="Docker Compose format:"
          :options="formatOptions"
          placeholder="Select Docker Compose format"
        />
      </n-gi>
      <n-gi span="2">
        <n-form-item label="Indent size:" label-placement="top" label-width="100" :show-feedback="false">
          <n-input-number v-model:value="indentSize" min="0" max="10" w-100px />
        </n-form-item>
      </n-gi>
    </n-grid>

    <n-divider />

    <TextareaCopyable :value="dockerCompose" language="yaml" />

    <div mt-5 flex justify-center>
      <c-button :disabled="dockerCompose === ''" secondary @click="download">
        Download docker-compose.yml
      </c-button>
    </div>

    <div v-if="errors.length > 0">
      <n-alert title="The following errors occured" type="error" mt-5>
        <ul>
          <li v-for="(message, index) of errors" :key="index">
            {{ message }}
          </li>
        </ul>
      </n-alert>
    </div>
  </div>
</template>
