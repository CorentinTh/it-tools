<script setup lang="ts">
import { MessageType, composerize } from 'composerize-ts';
import { removeObsoleteComposeVersion } from './docker-compose-output';
import { withDefaultOnError } from '@/utils/defaults';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { textToBase64 } from '@/utils/base64';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import CInputText from '@/ui/c-input-text/c-input-text.vue';

const dockerRun = ref(
  'docker run -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock:ro --restart always --log-opt max-size=1g nginx',
);

const conversionResult = computed(() =>
  withDefaultOnError(() => composerize(dockerRun.value.trim()), { yaml: '', messages: [] }),
);
const dockerCompose = computed(() => removeObsoleteComposeVersion(conversionResult.value.yaml));
const notImplemented = computed(() =>
  conversionResult.value.messages.filter(msg => msg.type === MessageType.notImplemented).map(msg => msg.value),
);
const notComposable = computed(() =>
  conversionResult.value.messages.filter(msg => msg.type === MessageType.notTranslatable).map(msg => msg.value),
);
const errors = computed(() =>
  conversionResult.value.messages
    .filter(msg => msg.type === MessageType.errorDuringConversion)
    .map(msg => msg.value),
);
const dockerComposeBase64 = computed(() => `data:application/yaml;base64,${textToBase64(dockerCompose.value)}`);
const { download } = useDownloadFileFromBase64({ source: dockerComposeBase64, filename: 'docker-compose.yml' });
const inputElement = ref<typeof CInputText>();
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <div class="c-tool-panel">
      <CInputText
        ref="inputElement"
        v-model:value="dockerRun"
        label="Docker run command"
        raw-text multiline monospace
        placeholder="Your docker run command to convert..."
        rows="18"
      />
    </div>

    <div class="c-tool-panel">
      <div mb-5px>
        Docker compose output
      </div>
      <TextareaCopyable
        :value="dockerCompose"
        language="yaml"
        :follow-height-of="inputElement?.inputWrapperRef"
      />
    </div>

    <div mt-5 flex justify-center>
      <c-button :disabled="dockerCompose === ''" @click="download">
        Download docker-compose.yml
      </c-button>
    </div>

    <div v-if="notComposable.length > 0">
      <n-alert title="This options are not translatable to docker-compose" type="info" mt-5>
        <ul>
          <li v-for="(message, index) of notComposable" :key="index">
            {{ message }}
          </li>
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
          <li v-for="(message, index) of notImplemented" :key="index">
            {{ message }}
          </li>
        </ul>
      </n-alert>
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
