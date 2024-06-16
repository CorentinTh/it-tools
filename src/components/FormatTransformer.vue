<script setup lang="ts">
import _ from 'lodash';
import { Base64 } from 'js-base64';
import type { UseValidationRule } from '@/composable/validation';
import CInputText from '@/ui/c-input-text/c-input-text.vue';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';

const props = withDefaults(
  defineProps<{
    transformer?: (v: string) => string
    inputValidationRules?: UseValidationRule<string>[]
    inputLabel?: string
    inputPlaceholder?: string
    inputDefault?: string
    outputLabel?: string
    outputLanguage?: string
    downloadFileName?: string
    downloadButtonText?: string
  }>(),
  {
    transformer: _.identity,
    inputValidationRules: () => [],
    inputLabel: 'Input',
    inputDefault: '',
    inputPlaceholder: 'Input...',
    outputLabel: 'Output',
    outputLanguage: '',
    downloadFileName: '',
    downloadButtonText: 'Download',
  },
);

const {
  transformer, inputValidationRules, inputLabel, outputLabel, outputLanguage,
  inputPlaceholder, inputDefault, downloadFileName, downloadButtonText,
} = toRefs(props);

const inputElement = ref<typeof CInputText>();

const input = ref(inputDefault.value);
const output = computed(() => transformer.value(input.value));

const outputBase64 = computed(() => Base64.encode(output.value));
const { download } = useDownloadFileFromBase64(
  {
    source: outputBase64,
    filename: downloadFileName,
  });
</script>

<template>
  <CInputText
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
    monospace
  />

  <div>
    <div mb-5px>
      {{ outputLabel }}
    </div>
    <textarea-copyable :value="output" :language="outputLanguage" :follow-height-of="inputElement?.inputWrapperRef" />

    <div v-if="downloadFileName !== '' && output !== ''" mt-5 flex justify-center>
      <c-button secondary @click="download">
        {{ downloadButtonText }}
      </c-button>
    </div>
  </div>
</template>
