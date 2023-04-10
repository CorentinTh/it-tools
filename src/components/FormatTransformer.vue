<template>
  <n-form-item :label="inputLabel" v-bind="validationAttrs">
    <n-input
      ref="inputElement"
      v-model:value="input"
      :placeholder="inputPlaceholder"
      type="textarea"
      rows="20"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      :input-props="{ 'data-test-id': 'input' }"
    />
  </n-form-item>
  <n-form-item :label="outputLabel">
    <textarea-copyable :value="output" :language="outputLanguage" :follow-height-of="inputElement" />
  </n-form-item>
</template>

<script setup lang="ts">
import { useValidation, type UseValidationRule } from '@/composable/validation';
import _ from 'lodash';

const props = withDefaults(
  defineProps<{
    transformer?: (v: string) => string;
    inputValidationRules?: UseValidationRule<string>[];
    inputLabel?: string;
    inputPlaceholder?: string;
    inputDefault?: string;
    outputLabel?: string;
    outputLanguage?: string;
  }>(),
  {
    transformer: _.identity,
    inputValidationRules: () => [],
    inputLabel: 'Input',
    inputDefault: '',
    inputPlaceholder: 'Input...',
    outputLabel: 'Output',
    outputLanguage: '',
  },
);

const { transformer, inputValidationRules, inputLabel, outputLabel, outputLanguage, inputPlaceholder, inputDefault } =
  toRefs(props);

const inputElement = ref();

const input = ref(inputDefault.value);
const output = computed(() => transformer.value(input.value));

const { attrs: validationAttrs } = useValidation({ source: input, rules: inputValidationRules.value });
</script>

<style scoped></style>
