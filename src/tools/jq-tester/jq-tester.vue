<script setup lang="ts">
import JSON5 from 'json5';
import jsonpath from 'jsonpath';
import jq from 'jq-wasm';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useValidation } from '@/composable/validation';

type JQType = 'jq' | 'jsonpath';
const indent = 2;

const jqOrJsonPath = ref('');
const json = ref('');
const jqtype = ref<JQType>('jq');
const jqtypes = [
  { value: 'jq', label: 'jq' },
  { value: 'jsonpath', label: 'JSONPath' },
];

const result = computedAsync(async () => {
  const jqOrJsonPathString = jqOrJsonPath.value;
  const jsonString = json.value;
  const jqtypeValue = jqtype.value;

  try {
    const obj = JSON5.parse(jsonString);
    if (jqtypeValue === 'jq') {
      return JSON.stringify(await jq.json(obj, jqOrJsonPathString), null, indent);
    }
    return JSON.stringify(jsonpath.query(obj, jqOrJsonPathString), null, indent);
  }
  catch (e: any) {
    return e.toString();
  }
});

const jsonValidation = useValidation({
  source: json,
  rules: [
    {
      validator: v => JSON5.parse(v),
      message: 'Provided JSON is not valid.',
    },
  ],
});
</script>

<template>
  <div style="max-width: 600px;">
    <c-card title="Input" mb-2>
      <c-input-text
        v-model:value="jqOrJsonPath"
        label="jq or JSONPath"
        placeholder="Put your jq or JSONPath here..."
        mb-2
      />

      <n-radio-group v-model:value="jqtype" name="jqtype">
        <n-space>
          <n-radio
            v-for="type in jqtypes"
            :key="type.value"
            :value="type.value"
            :label="type.label"
          />
        </n-space>
      </n-radio-group>

      <c-input-text
        v-model:value="json"
        label="JSON"
        multiline
        placeholder="Put your JSON here..."
        rows="5"
        :validation="jsonValidation"
        mb-2
      />
    </c-card>

    <c-card title="Result">
      <TextareaCopyable :value="result" language="json" />
    </c-card>
  </div>
</template>
