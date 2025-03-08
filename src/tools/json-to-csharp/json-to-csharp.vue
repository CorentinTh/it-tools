<script setup lang="ts">
import JSON5 from 'json5';
import json2csharp from './json2csharp';
import type { UseValidationRule } from '@/composable/validation';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { withDefaultOnError } from '@/utils/defaults';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const defaultValue = `{
  a:"n",
  arr: [1, 2], 
  nested: {
    a:1,
    b:"2"
  }
}`;
const jsonInput = ref(defaultValue);
const pascalCase = useQueryParamOrStorage({ name: 'pascalcase', storageName: 'json-c#:pc', defaultValue: true });
const useFields = useQueryParamOrStorage({ name: 'fields', storageName: 'json-c#:fi', defaultValue: false });
const useNullable = useQueryParamOrStorage({ name: 'nullable', storageName: 'json-c#:null', defaultValue: false });
const addJsonProperty = useQueryParamOrStorage({ name: 'pascal', storageName: 'json-c#:jsp', defaultValue: false });
const nullValueHandlingIgnore = useQueryParamOrStorage({ name: 'pascal', storageName: 'json-c#:ign', defaultValue: true });
const addJsonPropertyName = useQueryParamOrStorage({ name: 'pascal', storageName: 'json-c#:jspp', defaultValue: true });
const generateImmutableClasses = useQueryParamOrStorage({ name: 'pascal', storageName: 'json-c#:imm', defaultValue: false });
const useRecordTypes = useQueryParamOrStorage({ name: 'pascal', storageName: 'json-c#:rec', defaultValue: true });
const useReadonlyLists = useQueryParamOrStorage({ name: 'pascal', storageName: 'json-c#:rdl', defaultValue: false });
const rootTypeName = useQueryParamOrStorage({ name: 'root', storageName: 'json-c#:rt', defaultValue: 'Root' });

const csharpOutput = computed(() => withDefaultOnError(
  () => json2csharp({
    src: JSON5.parse(jsonInput.value),
    rootTypeName: rootTypeName.value,
    pascalCase: pascalCase.value,
    useFields: useFields.value,
    useNullable: useNullable.value,
    addJsonProperty: addJsonProperty.value,
    nullValueHandlingIgnore: nullValueHandlingIgnore.value,
    addJsonPropertyName: addJsonPropertyName.value,
    generateImmutableClasses: generateImmutableClasses.value,
    useRecordTypes: useRecordTypes.value,
    useReadonlyLists: useReadonlyLists.value,
  }), ''));
const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: 'Provided JSON is not valid.',
  },
];
</script>

<template>
  <div>
    <c-card title="JSON to C#">
      <c-input-text
        v-model:value="jsonInput"
        multiline
        placeholder="Put your json string here..."
        rows="10"
        label="JSON to C#"
        :validation-rules="rules"
        raw-text
        mb-5
      />
      <n-space justify="center">
        <n-checkbox v-model:checked="pascalCase">
          Use Pascal case
        </n-checkbox>
        <n-checkbox v-model:checked="useRecordTypes">
          Use Record types
        </n-checkbox>
        <n-checkbox v-model:checked="generateImmutableClasses">
          Generate Immutable classes
        </n-checkbox>
        <n-checkbox v-model:checked="useFields">
          Use fields
        </n-checkbox>
        <n-checkbox v-model:checked="addJsonProperty">
          Add JsonProperty attributes
        </n-checkbox>
        <n-checkbox v-model:checked="nullValueHandlingIgnore" :disabled="!addJsonProperty">
          Use NullValueHandling.Ignore
        </n-checkbox>
        <n-checkbox v-model:checked="addJsonPropertyName">
          Add JsonPropertyName attributes
        </n-checkbox>
        <n-checkbox v-model:checked="useNullable">
          Use nullable types
        </n-checkbox>
        <n-checkbox v-model:checked="useReadonlyLists">
          Use Readonly lists
        </n-checkbox>
      </n-space>
      <c-input-text v-model:value="rootTypeName" label="Root type name" placeholder="Your root type name..." clearable raw-text mb-5 />
    </c-card>
    <c-card title="Your C# code" mt-2>
      <TextareaCopyable
        :value="csharpOutput"
        language="csharp"
      />
    </c-card>
  </div>
</template>
