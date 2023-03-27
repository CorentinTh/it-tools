<template>
  <div>
    <n-form-item label="Your docker run command:" :show-feedback="false">
      <n-input
        v-model:value="dockerRun"
        style="font-family: monospace"
        type="textarea"
        placeholder="Your docker run command to convert..."
        rows="3"
      />
    </n-form-item>

    <n-divider />

    <textarea-copyable :value="dockerCompose" language="yaml" />
    <br />
    <br />
    <n-space justify="center">
      <n-button :disabled="dockerCompose === ''" secondary @click="download"> Download docker-compose.yml </n-button>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { withDefaultOnError } from '@/utils/defaults';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { textToBase64 } from '@/utils/base64';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

import composerize from 'composerize';

const dockerRun = ref(
  'docker run -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock:ro --restart always --log-opt max-size=1g nginx',
);
const dockerCompose = computed(() => withDefaultOnError(() => composerize(dockerRun.value), ''));
const dockerComposeBase64 = computed(() => 'data:application/yaml;base64,' + textToBase64(dockerCompose.value));
const { download } = useDownloadFileFromBase64({ source: dockerComposeBase64, filename: 'docker-compose.yml' });
</script>
