<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { formatYaml } from './yaml-models';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const rawYaml = useStorage('yaml-prettify:raw-yaml', '');
const indentSize = useStorage('yaml-prettify:indent-size', 2);
const sortKeys = useStorage('yaml-prettify:sort-keys', false);

const yamlFormattingResult = computed(() => {
  try {
    return { yaml: formatYaml({ rawYaml, indentSize, sortKeys }), errors: [] };
  }
  catch (e: any) {
    return { yaml: '#see error messages', errors: e.toString().split('\n') };
  }
});
const errors = computed(() => yamlFormattingResult.value.errors);
const cleanYaml = computed(() => yamlFormattingResult.value.yaml);

const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
};
</script>

<template>
  <div max-w-600>
    <div style="flex: 0 0 100%">
      <div style="margin: 0 auto; max-width: 600px" flex justify-center gap-3>
        <n-form-item label="Sort keys :" label-placement="left" label-width="100">
          <n-switch v-model:value="sortKeys" />
        </n-form-item>
        <n-form-item label="Indent size :" label-placement="left" label-width="100" :show-feedback="false">
          <n-input-number v-model:value="indentSize" min="1" max="10" style="width: 100px" />
        </n-form-item>
      </div>
    </div>

    <c-label label="Your raw YAML:">
      <div relative w-full>
        <c-monaco-editor
          v-model:value="rawYaml"
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

    <n-form-item label="Prettified version of your YAML">
      <TextareaCopyable :value="cleanYaml" language="yaml" />
    </n-form-item>
  </div>
</template>

  <style lang="less" scoped>
    .result-card {
    position: relative;
    .copy-button {
    position: absolute;
    top: 10px;
    right: 10px;
    }
    }
  </style>
