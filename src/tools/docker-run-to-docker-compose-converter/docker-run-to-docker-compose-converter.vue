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

    <n-space justify="center" mt-5>
      <c-button :disabled="dockerCompose === ''" secondary @click="download"> Download docker-compose.yml </c-button>
    </n-space>

    <div v-if="notComposable.length > 0">
      <n-alert title="This options are not translatable to docker-compose" type="info" mt-5>
        <ul>
          <li v-for="(message, index) of notComposable" :key="index">{{ message }}</li>
        </ul>
      </n-alert>
    </div>

    <div v-if="notImplemented.length > 0">
      <n-alert
        title="This options are not yet implemented and therefore haven't been translated to docker-compose"
        type="warning"
        mt-5
      >
        <ul>
          <li v-for="(message, index) of notImplemented" :key="index">{{ message }}</li>
        </ul>
      </n-alert>
    </div>

    <div v-if="errors.length > 0">
      <n-alert title="The following errors occured" type="error" mt-5>
        <ul>
          <li v-for="(message, index) of errors" :key="index">{{ message }}</li>
        </ul>
      </n-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { withDefaultOnError } from '@/utils/defaults';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { textToBase64 } from '@/utils/base64';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

import { composerize, MessageType } from 'composerize-ts';

const dockerRun = ref(
  'docker run -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock:ro --restart always --log-opt max-size=1g nginx',
);

const conversionResult = computed(() =>
  withDefaultOnError(() => composerize(dockerRun.value), { yaml: '', messages: [] }),
);
const dockerCompose = computed(() => conversionResult.value.yaml);
const notImplemented = computed(() =>
  conversionResult.value.messages.filter((msg) => msg.type === MessageType.notImplemented).map((msg) => msg.value),
);
const notComposable = computed(() =>
  conversionResult.value.messages.filter((msg) => msg.type === MessageType.notTranslatable).map((msg) => msg.value),
);
const errors = computed(() =>
  conversionResult.value.messages
    .filter((msg) => msg.type === MessageType.errorDuringConversion)
    .map((msg) => msg.value),
);
const dockerComposeBase64 = computed(() => 'data:application/yaml;base64,' + textToBase64(dockerCompose.value));
const { download } = useDownloadFileFromBase64({ source: dockerComposeBase64, filename: 'docker-compose.yml' });
</script>
