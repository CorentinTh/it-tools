<template>
  <n-card>
    <n-input
      v-model:value="dockerRun"
      style="font-family: monospace"
      type="textarea"
      placeholder="Your docker run command to convert..."
      rows="3"
    />

    <n-divider />

    <n-input
      style="font-family: monospace"
      :value="dockerCompose"
      type="textarea"
      placeholder="Converted to docker-compose file"
      :autosize="{ minRows: 1 }"
      readonly
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
    />
    <br />
    <br />
    <n-space justify="center">
      <n-button secondary autofocus @click="copy"> Copy </n-button>
      <n-button :disabled="dockerCompose === ''" secondary @click="downloadFile()"> Download file </n-button>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { textToBase64 } from '@/utils/base64';
import { computed, ref, watch } from 'vue';
import composerize from 'composerize';

const dockerRun = ref(
  'docker run -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock:ro --restart always --log-opt max-size=1g nginx',
);
const dockerCompose = ref('');
const dockerComposeBase64 = computed(() => 'data:application/yaml;base64,' + textToBase64(dockerCompose.value));
const { copy } = useCopy({ source: dockerCompose, text: 'docker-compose copied to the clipboard' });
const { download } = useDownloadFileFromBase64({ source: dockerComposeBase64, filename: 'docker-compose.yml' });

function downloadFile() {
  if (dockerCompose.value === '') return;
  try {
    //dockerComposeBase64 = 'data:application/yaml;base64,' + dockerComposeBase64.value;
    download();
  } catch (_) {
    //
  }
}

watch([dockerRun], convertToCompose, { immediate: true });

function convertToCompose() {
  dockerCompose.value = composerize(dockerRun.value);
}
</script>
