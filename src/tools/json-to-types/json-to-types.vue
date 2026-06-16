<script setup lang="ts">
import JSON5 from 'json5';
import { jsonToGoStruct, jsonToTypeScript } from './json-to-types.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useStyleStore } from '@/stores/style.store';
import { withDefaultOnError } from '@/utils/defaults';

const styleStore = useStyleStore();

const languages = [
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Go', value: 'go' },
] as { label: string; value: string }[];

const selectedLanguage = ref('typescript');
const rootName = ref('RootType');
const inputJson = ref('{\n  "name": "John",\n  "age": 30,\n  "active": true,\n  "tags": ["admin", "user"],\n  "address": {\n    "street": "123 Main St",\n    "city": "Springfield"\n  }\n}');

const output = computed(() =>
  withDefaultOnError(() => {
    const parsed = JSON5.parse(inputJson.value);
    if (selectedLanguage.value === 'go') {
      return jsonToGoStruct(parsed, rootName.value || 'RootType');
    }
    return jsonToTypeScript(parsed, rootName.value || 'RootType');
  }, ''),
);

const outputLanguage = computed(() => selectedLanguage.value === 'go' ? 'go' : 'typescript');
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="max-width: 600px" :class="{ 'flex-col': styleStore.isSmallScreen }" mx-auto mb-5 flex gap-2>
      <c-select
        v-model:value="selectedLanguage"
        label="Target language"
        style="flex: 1"
        :options="languages"
      />
      <c-input-text
        v-model:value="rootName"
        label="Root type name"
        placeholder="RootType"
        style="flex: 1"
      />
    </div>
  </div>

  <n-form-item label="Your JSON">
    <c-input-text
      v-model:value="inputJson"
      placeholder="Paste your JSON here..."
      rows="15"
      multiline
      monospace
      raw-text
    />
  </n-form-item>

  <n-form-item label="Generated types">
    <TextareaCopyable :value="output" :language="outputLanguage" />
  </n-form-item>
</template>
