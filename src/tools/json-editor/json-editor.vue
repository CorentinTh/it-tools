<script setup lang="ts">
import JsonEditorVue from 'json-editor-vue3';
import { withDefaultOnError } from '@/utils/defaults';

const jsonData = ref({ array: [1, 2, 3] });
const jsonText = computed(() => withDefaultOnError(() => JSON.stringify(jsonData.value, null, 2), ''));
</script>

<template>
  <div>
    <JsonEditorVue
      v-model="jsonData"
      mode="text"
    />

    <n-divider />

    <n-form-item label="Your edited JSON:">
      <textarea-copyable :value="jsonText" language="json" />
    </n-form-item>
  </div>
</template>
