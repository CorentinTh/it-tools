<script setup lang="ts">
import composerize from 'composerize';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { textToBase64 } from '@/utils/base64';

const dockerRun = ref(
  'docker run -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock:ro --restart always --log-opt max-size=1g nginx',
);

// composerize lists the options it cannot translate as comments at the top of the generated YAML.
const conversionResult = computed(() => {
  try {
    return { yaml: composerize(dockerRun.value.trim()), error: '' };
  }
  catch (error) {
    return { yaml: '', error: error instanceof Error ? error.message : String(error) };
  }
});
const dockerCompose = computed(() => conversionResult.value.yaml);
const conversionError = computed(() => conversionResult.value.error);
const dockerComposeBase64 = computed(() => `data:application/yaml;base64,${textToBase64(dockerCompose.value)}`);
const { download } = useDownloadFileFromBase64({ source: dockerComposeBase64, filename: 'docker-compose.yml' });
</script>

<template>
  <div>
    <c-input-text
      v-model:value="dockerRun"
      label="Your docker run command:"
      style="font-family: monospace"
      multiline
      raw-text
      monospace
      placeholder="Your docker run command to convert..."
      rows="3"
    />

    <n-divider />

    <TextareaCopyable :value="dockerCompose" language="yaml" />

    <div mt-5 flex justify-center>
      <c-button :disabled="dockerCompose === ''" secondary @click="download">
        Download docker-compose.yml
      </c-button>
    </div>

    <c-alert v-if="conversionError" type="error" title="The command could not be converted" mt-5>
      {{ conversionError }}
    </c-alert>
  </div>
</template>
