<script setup lang="ts">
import decomposerize from 'decomposerize';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const detachOption = ref<boolean>(false);
const removeOption = ref<boolean>(false);
const longArgsOption = ref<boolean>(false);
const equalAsSepOption = ref<boolean>(false);

const dockerCompose = ref(
  `version: '3.3'
services:
    nginx:
        ports:
            - '80:80'
        volumes:
            - '/var/run/docker.sock:/tmp/docker.sock:ro'
        restart: always
        logging:
            options:
                max-size: 1g
        image: nginx`,
);

const conversionResult = computed(() => {
  try {
    const config = {
      'detach': detachOption.value,
      'rm': removeOption.value,
      'long-args': longArgsOption.value,
      'arg-value-separator': equalAsSepOption.value ? '=' : ' ',
    };
    return { commands: decomposerize(dockerCompose.value.trim(), config), errors: [] };
  }
  catch (e: any) {
    return { commands: '#see error messages', errors: e.toString().split('\n') };
  }
});

const errors = computed(() => conversionResult.value.errors);
const dockerRunCommands = computed(() => conversionResult.value.commands);

const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
};
</script>

<template>
  <div>
    <c-label label="Paste your Docker Compose file content:">
      <div relative w-full>
        <c-monaco-editor
          v-model:value="dockerCompose"
          theme="vs-dark"
          language="yaml"
          height="250px"
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

    <div class="mb-6 flex flex-row items-center gap-2">
      <n-checkbox v-model:checked="detachOption">
        Detach (-d)
      </n-checkbox>
      <n-checkbox v-model:checked="removeOption">
        Remove (--rm)
      </n-checkbox>
      <n-checkbox v-model:checked="longArgsOption">
        Long Arguments
      </n-checkbox>
      <n-checkbox v-model:checked="equalAsSepOption">
        --<i>arg</i>=<i>value</i> ?
      </n-checkbox>
    </div>

    <n-divider />

    <TextareaCopyable :value="dockerRunCommands" language="bash" copy-placement="outside" />
  </div>
</template>
