<template>
  <c-card title="String to base64">
    <c-input-text
      v-model:value="textInput"
      multiline
      placeholder="Put your string here..."
      rows="5"
      label="String to encode"
      raw-text
      mb-5
    />

    <c-input-text
      label="Base64 of string"
      :value="base64Output"
      multiline
      readonly
      placeholder="The base64 encoding of your string will be here"
      rows="5"
      mb-5
    />

    <div flex justify-center>
      <c-button @click="copyTextBase64()"> Copy base64 </c-button>
    </div>
  </c-card>

  <c-card title="Base64 to string">
    <c-input-text
      v-model:value="base64Input"
      multiline
      placeholder="Your base64 string..."
      rows="5"
      :validation-rules="b64ValidationRules"
      label="Base64 string to decode"
      mb-5
    />

    <c-input-text
      v-model:value="textOutput"
      label="Decoded string"
      placeholder="The decoded string will be here"
      multiline
      rows="5"
      readonly
      mb-5
    />

    <div flex justify-center>
      <c-button @click="copyText()"> Copy decoded string </c-button>
    </div>
  </c-card>
</template>

<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { base64ToText, isValidBase64, textToBase64 } from '@/utils/base64';
import { withDefaultOnError } from '@/utils/defaults';
import { computed, ref } from 'vue';

const textInput = ref('');
const base64Output = computed(() => textToBase64(textInput.value));
const { copy: copyTextBase64 } = useCopy({ source: base64Output, text: 'Base64 string copied to the clipboard' });

const base64Input = ref('');
const textOutput = computed(() => withDefaultOnError(() => base64ToText(base64Input.value.trim()), ''));
const { copy: copyText } = useCopy({ source: textOutput, text: 'String copied to the clipboard' });

const b64ValidationRules = [
  { message: 'Invalid base64 string', validator: (value: string) => isValidBase64(value.trim()) },
];
</script>
