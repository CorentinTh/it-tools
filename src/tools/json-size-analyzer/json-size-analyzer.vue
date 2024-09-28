<script setup lang="ts">
import JSON5 from 'json5';
import { getJsonUsageTreeNodes } from './json-size-analyzer.service';
import { useValidation } from '@/composable/validation';

const json = ref('{"a": 1, "b": [1,2,3]}');
const maxDepth = ref(100);
const target = ref('');

const jsonSizes = computed(() => {
  const jsonObj = JSON5.parse(json.value);
  if (!jsonObj) {
    return null;
  }
  return [getJsonUsageTreeNodes(jsonObj, maxDepth.value - 1, target.value)];
});
const searchInAnalysis = ref('');

const jsonValidation = useValidation({
  source: json,
  rules: [
    {
      validator: (v) => {
        return JSON5.parse(v);
      },
      message: 'Provided JSON is not valid.',
    },
  ],
});
</script>

<template>
  <div style="max-width: 600px;">
    <c-card title="Input" mb-2>
      <c-input-text
        v-model:value="json"
        label="JSON"
        multiline
        placeholder="Put your JSON data here..."
        rows="5"
        :validation="jsonValidation"
        mb-2
      />

      <n-form-item label="Max Depth:" label-placement="left">
        <n-input-number v-model:value="maxDepth" :min="0" w-full />
      </n-form-item>

      <c-input-text
        v-model:value="target"
        label="Target Node"
        placeholder="Where to start the analyze (ie, a[0].b.c)"
        mb-2
      />
    </c-card>

    <c-card v-if="jsonSizes" title="Analysis">
      <n-input v-model:value="searchInAnalysis" placeholder="Search in result" />
      <n-tree
        :show-irrelevant-nodes="false"
        :pattern="searchInAnalysis"
        :default-expand-all="true"
        :data="jsonSizes"
        block-line
      />
    </c-card>
  </div>
</template>
