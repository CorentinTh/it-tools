<template>
  <c-card title="String to base64">
    <n-form-item label="String to encode">
      <n-input v-model:value="textInput" type="textarea" placeholder="Put your string here..." rows="5" />
    </n-form-item>

    <n-form-item label="Base64 of string">
      <n-input
        :value="base64Output"
        type="textarea"
        readonly
        placeholder="The base64 encoding of your string will be here"
        rows="5"
      />
    </n-form-item>

    <n-space justify="center">
      <c-button @click="copyTextBase64()"> Copy base64 </c-button>
    </n-space>
  </c-card>

  <c-card title="Base64 to string">
    <n-form-item label="Base64 string to decode" v-bind="b64Validation.attrs">
      <n-input v-model:value="base64Input" type="textarea" placeholder="Your base64 string..." rows="5" />
    </n-form-item>

    <n-form-item label="Decoded string">
      <n-input :value="textOutput" type="textarea" readonly placeholder="The decoded string will be here" rows="5" />
    </n-form-item>

    <n-space justify="center">
      <c-button @click="copyText()"> Copy decoded string </c-button>
    </n-space>
  </c-card>
</template>

<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { useValidation } from '@/composable/validation';
import { base64ToText, isValidBase64, textToBase64 } from '@/utils/base64';
import { withDefaultOnError } from '@/utils/defaults';
import { computed, ref } from 'vue';

const textInput = ref('');
const base64Output = computed(() => textToBase64(textInput.value));
const { copy: copyTextBase64 } = useCopy({ source: base64Output, text: 'Base64 string copied to the clipboard' });

const base64Input = ref('');
const textOutput = computed(() => withDefaultOnError(() => base64ToText(base64Input.value.trim()), ''));
const { copy: copyText } = useCopy({ source: textOutput, text: 'String copied to the clipboard' });
const b64Validation = useValidation({
  source: base64Input,
  rules: [{ message: 'Invalid base64 string', validator: (value) => isValidBase64(value.trim()) }],
});
</script>
