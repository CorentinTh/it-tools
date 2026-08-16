<script setup lang="ts">
import { DockerConverterWorkerClient } from './docker-converter.worker-client';
import {
  DOCKER_CONVERTER_LIVE_MAX_BYTES,
  DOCKER_CONVERTER_MAX_INPUT_BYTES,
  type DockerConverterDirection,
  type DockerConverterMessage,
} from './docker-converter.worker.protocol';
import { downloadTextFile } from '@/composable/downloadText';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import CInputText from '@/ui/c-input-text/c-input-text.vue';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { BoundedTextTaskError } from '@/utils/bounded-text-task';

const dockerRun = ref(
  'docker run -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock:ro --restart always --log-opt max-size=1g nginx',
);
const direction = ref<DockerConverterDirection>('run-to-compose');
const directionOptions: Array<{ label: string; value: DockerConverterDirection }> = [
  { label: 'Docker run → Compose', value: 'run-to-compose' },
  { label: 'Compose → Docker run', value: 'compose-to-run' },
];

const dockerCompose = shallowRef('');
const messages = shallowRef<DockerConverterMessage[]>([]);
const client = new DockerConverterWorkerClient();
const state = reactive<{ message: string; status: 'idle' | 'pending' | 'running' | 'success' | 'cancelled' | 'timeout' | 'error' }>({
  message: '',
  status: 'idle',
});
let timer: ReturnType<typeof globalThis.setTimeout> | undefined;
let requestId = 0;

const isRunning = computed(() => state.status === 'running');
const hasError = computed(() => state.status === 'error' || state.status === 'timeout');
const notImplemented = computed(() =>
  messages.value.filter(message => message.type === 'notImplemented').map(message => message.value),
);
const notComposable = computed(() =>
  messages.value.filter(message => message.type === 'notTranslatable').map(message => message.value),
);
const errors = computed(() =>
  messages.value.filter(message => message.type === 'errorDuringConversion').map(message => message.value),
);
const inputElement = ref<typeof CInputText>();

function clearTimer(): void {
  if (timer !== undefined) {
    globalThis.clearTimeout(timer);
    timer = undefined;
  }
}

async function convert(): Promise<void> {
  clearTimer();
  if (dockerRun.value.trim() === '') {
    dockerCompose.value = '';
    messages.value = [];
    state.status = 'idle';
    state.message = '';
    return;
  }
  const currentRequest = ++requestId;
  state.status = 'running';
  state.message = 'Docker conversion is running…';
  try {
    const result = await client.run({ direction: direction.value, source: dockerRun.value });
    if (currentRequest !== requestId) {
      return;
    }
    dockerCompose.value = result.value.yaml;
    messages.value = result.value.messages;
    state.status = 'success';
    state.message = `Docker conversion completed in ${Math.round(result.elapsedMs)} ms.`;
  }
  catch (error) {
    if (currentRequest !== requestId) {
      return;
    }
    const taskError = error instanceof BoundedTextTaskError
      ? error
      : new BoundedTextTaskError('processing', 'The Docker run command could not be converted.');
    state.status = taskError.code === 'timeout' ? 'timeout' : taskError.code === 'cancelled' ? 'cancelled' : 'error';
    state.message = dockerCompose.value === '' ? taskError.message : `${taskError.message} The previous result remains available.`;
  }
}

function scheduleConversion(): void {
  clearTimer();
  ++requestId;
  client.cancel('Docker conversion cancelled because its input changed.');
  if (dockerRun.value.trim() === '') {
    dockerCompose.value = '';
    messages.value = [];
    state.status = 'idle';
    state.message = '';
  }
  else if (dockerRun.value.length > DOCKER_CONVERTER_MAX_INPUT_BYTES) {
    state.status = 'error';
    state.message = `Docker command input is limited to ${DOCKER_CONVERTER_MAX_INPUT_BYTES.toLocaleString('en')} UTF-8 bytes.`;
  }
  else if (exceedsUtf8ByteLimit(dockerRun.value, DOCKER_CONVERTER_LIVE_MAX_BYTES)) {
    state.status = 'pending';
    state.message = 'Large Docker commands run only on request. Select Run Docker conversion.';
  }
  else {
    state.status = 'pending';
    state.message = 'Waiting to run Docker conversion…';
    timer = globalThis.setTimeout(convert, 250);
  }
}

function cancel(): void {
  clearTimer();
  ++requestId;
  client.cancel();
  state.status = 'cancelled';
  state.message = 'Docker conversion cancelled. The previous result remains available.';
}

function download(): void {
  downloadTextFile({
    content: dockerCompose.value,
    filename: direction.value === 'run-to-compose' ? 'docker-compose.yml' : 'docker-run.sh',
  });
}

watch(direction, (nextDirection) => {
  dockerRun.value = nextDirection === 'run-to-compose'
    ? 'docker run -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock:ro --restart always --log-opt max-size=1g nginx'
    : 'services:\n  web:\n    image: nginx:alpine\n    ports:\n      - "8080:80"\n    environment:\n      APP_MODE: development\n    volumes:\n      - ./site:/usr/share/nginx/html:ro';
});
watch([dockerRun, direction], scheduleConversion, { flush: 'post', immediate: true });
onUnmounted(() => {
  clearTimer();
  ++requestId;
  client.dispose();
});
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-buttons-select
      v-model:value="direction"
      label="Conversion direction"
      label-position="top"
      :options="directionOptions"
      data-test-id="docker-converter-direction"
    />
    <div class="c-tool-panel">
      <CInputText
        ref="inputElement"
        v-model:value="dockerRun"
        :label="direction === 'run-to-compose' ? 'Docker run command' : 'Docker Compose YAML'"
        raw-text multiline monospace
        :placeholder="direction === 'run-to-compose' ? 'Your docker run command to convert...' : 'Your Docker Compose YAML to convert...'"
        rows="18"
        test-id="docker-run-input"
      />
    </div>

    <div class="c-task-actions">
      <c-button type="primary" data-test-id="docker-converter-run" :disabled="dockerRun.trim() === '' || isRunning" @click="convert">
        {{ isRunning ? 'Converting…' : 'Run Docker conversion' }}
      </c-button>
      <c-button v-if="isRunning" type="warning" data-test-id="docker-converter-cancel" @click="cancel">
        Cancel
      </c-button>
    </div>
    <p
      v-if="state.message"
      data-test-id="docker-converter-status"
      role="status"
      aria-live="polite"
      :class="{ 'status-error': hasError }"
    >
      {{ state.message }}
    </p>

    <div class="c-tool-panel">
      <div mb-5px>
        {{ direction === 'run-to-compose' ? 'Docker Compose output' : 'Docker run output' }}
      </div>
      <TextareaCopyable
        :value="dockerCompose"
        :language="direction === 'run-to-compose' ? 'yaml' : 'shell'"
        :follow-height-of="inputElement?.inputWrapperRef"
      />
    </div>

    <div class="c-task-actions">
      <c-button :disabled="dockerCompose === ''" @click="download">
        {{ direction === 'run-to-compose' ? 'Download docker-compose.yml' : 'Download docker-run.sh' }}
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

<style scoped>
.status-error {
  color: var(--n-feedback-text-color-error);
}
</style>
