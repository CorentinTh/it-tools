<template>
  <c-input-text
    ref="inputElement"
    v-model:value="input"
    :placeholder="inputPlaceholder"
    :label="inputLabel"
    rows="20"
    autosize
    raw-text
    multiline
    test-id="input"
    :validation-rules="inputValidationRules"
  />

  <div>
    <div mb-5px>{{ outputLabel }}</div>
    <textarea-copyable :value="output" :language="outputLanguage" :follow-height-of="inputElement?.inputWrapperRef" />
  </div>
</template>

<script setup lang="ts">
import type { UseValidationRule } from '@/composable/validation';
import _ from 'lodash';
import CInputText from '@/ui/c-input-text/c-input-text.vue';

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

const inputElement = ref<typeof CInputText>();

const input = ref(inputDefault.value);
const output = computed(() => transformer.value(input.value));
</script>

<style scoped></style>
