<template>
  <c-card title="Encode">
    <n-form-item
      label="Your string :"
      :feedback="encodedValidation.message"
      :validation-status="encodedValidation.status"
    >
      <n-input
        v-model:value="encodeInput"
        type="textarea"
        placeholder="The string to encode"
        :autosize="{ minRows: 2 }"
      />
    </n-form-item>

    <n-form-item label="Your string encoded :">
      <n-input
        :value="encodeOutput"
        type="textarea"
        readonly
        placeholder="Your string encoded"
        :autosize="{ minRows: 2 }"
      />
    </n-form-item>

    <n-space justify="center">
      <c-button @click="copyEncoded"> Copy </c-button>
    </n-space>
  </c-card>
  <c-card title="Decode">
    <n-form-item
      label="Your encoded string :"
      :feedback="decodeValidation.message"
      :validation-status="decodeValidation.status"
    >
      <n-input
        v-model:value="decodeInput"
        type="textarea"
        placeholder="The string to decode"
        :autosize="{ minRows: 2 }"
      />
    </n-form-item>

    <n-form-item label="Your string decoded :">
      <n-input
        :value="decodeOutput"
        type="textarea"
        readonly
        placeholder="Your string decoded"
        :autosize="{ minRows: 2 }"
      />
    </n-form-item>

    <n-space justify="center">
      <c-button @click="copyDecoded"> Copy </c-button>
    </n-space>
  </c-card>
</template>

<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';
import { computed, ref } from 'vue';

const encodeInput = ref('Hello world :)');
const encodeOutput = computed(() => withDefaultOnError(() => encodeURIComponent(encodeInput.value), ''));

const encodedValidation = useValidation({
  source: encodeInput,
  rules: [
    {
      validator: (value) => isNotThrowing(() => encodeURIComponent(value)),
      message: 'Impossible to parse this string',
    },
  ],
});

const { copy: copyEncoded } = useCopy({ source: encodeOutput, text: 'Encoded string copied to the clipboard' });

const decodeInput = ref('Hello%20world%20%3A)');
const decodeOutput = computed(() => withDefaultOnError(() => decodeURIComponent(decodeInput.value), ''));

const decodeValidation = useValidation({
  source: encodeInput,
  rules: [
    {
      validator: (value) => isNotThrowing(() => decodeURIComponent(value)),
      message: 'Impossible to parse this string',
    },
  ],
});

const { copy: copyDecoded } = useCopy({ source: decodeOutput, text: 'Decoded string copied to the clipboard' });
</script>
