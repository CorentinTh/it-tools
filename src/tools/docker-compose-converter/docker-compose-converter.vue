<script setup lang="ts">
import Composeverter from 'composeverter';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { textToBase64 } from '@/utils/base64';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const dockerCompose = ref(
  `nginx:
    ports:
        - '80:80'
    volumes:
        - '/var/run/docker.sock:/tmp/docker.sock:ro'
    image: nginx`,
);
const indentSize = useStorage('docker-compose-converter:indent-size', 4);

const expandVolumes = ref(
  false,
);
const expandPorts = ref(
  false,
);
const conversion = useStorage('docker-compose-converter:conversion', 'latest');
const conversionOptions = [
  { value: 'v1ToV2x', label: 'V1 to V2 2.x' },
  { value: 'v1ToV3x', label: 'V1 to V2 3.x' },
  { value: 'v2xToV3x', label: 'V2 - 2.x to 3.x' },
  { value: 'v3xToV2x', label: 'V2 - 3.x to 2.x' },
  { value: 'latest', label: 'To CommonSpec' },
];

const conversionResult = computed(() => {
  try {
    let convertedDockerCompose = '';
    const config = {
      expandPorts: expandPorts.value,
      expandVolumes: expandVolumes.value,
      indent: indentSize.value,
    };
    switch (conversion.value) {
      case 'latest':
        convertedDockerCompose = Composeverter.migrateToCommonSpec(dockerCompose.value, config);
        break;
      case 'v1ToV2x':
        convertedDockerCompose = Composeverter.migrateFromV1ToV2x(dockerCompose.value, config);
        break;
      case 'v1ToV3x':
        convertedDockerCompose = Composeverter.migrateFromV2xToV3x(Composeverter.migrateFromV1ToV2x(dockerCompose.value), config);
        break;
      case 'v2xToV3x':
        convertedDockerCompose = Composeverter.migrateFromV2xToV3x(dockerCompose.value, config);
        break;
      case 'v3xToV2x':
        convertedDockerCompose = Composeverter.migrateFromV3xToV2x(dockerCompose.value, config);
        break;

      default:
        throw new Error(`Unknown conversion '${conversion}'`);
    }
    return { yaml: convertedDockerCompose, errors: [] };
  }
  catch (e: any) {
    return { yaml: '#see error messages', errors: e.toString().split('\n') };
  }
});

const convertedDockerCompose = computed(() => conversionResult.value.yaml);
const errors = computed(() => conversionResult.value.errors);

const convertedDockerComposeBase64 = computed(() => `data:application/yaml;base64,${textToBase64(convertedDockerCompose.value)}`);
const { download } = useDownloadFileFromBase64({ source: convertedDockerComposeBase64, filename: 'docker-compose.yml' });

const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
};
</script>

<template>
  <div>
    <c-label label="Paste your existing Docker Compose:">
      <div relative w-full>
        <c-monaco-editor
          v-model:value="dockerCompose"
          theme="vs-dark"
          language="yaml"
          height="200px"
          :options="MONACO_EDITOR_OPTIONS"
        />
      </div>
    </c-label>

    <div v-if="errors.length > 0">
      <n-alert title="The following errors occured" type="error" mt-5>
        <ul>
          <li v-for="(message, index) of errors" :key="index">
            {{ message }}
          </li>
        </ul>
      </n-alert>
    </div>

    <n-divider />

    <n-grid cols="4" x-gap="12" w-full>
      <n-gi span="2">
        <c-select
          v-model:value="conversion"
          label-position="top"
          label="Docker Compose conversion:"
          :options="conversionOptions"
          placeholder="Select Docker Compose conversion"
        />
      </n-gi>
      <n-gi span="2">
        <n-form-item label="Indent size:" label-placement="top" label-width="100" :show-feedback="false">
          <n-input-number v-model:value="indentSize" min="0" max="10" w-100px />
        </n-form-item>
      </n-gi>
    </n-grid>

    <n-divider />

    <div class="mb-6 flex flex-row items-center gap-2">
      <n-checkbox v-model:checked="expandPorts">
        Expand Ports
      </n-checkbox>
      <n-checkbox v-model:checked="expandVolumes">
        Expand Volumes
      </n-checkbox>
    </div>

    <n-divider />

    <TextareaCopyable :value="convertedDockerCompose" language="yaml" />

    <div mt-5 flex justify-center>
      <c-button :disabled="dockerCompose === ''" secondary @click="download">
        Download converted docker-compose.yml
      </c-button>
    </div>
  </div>
</template>
