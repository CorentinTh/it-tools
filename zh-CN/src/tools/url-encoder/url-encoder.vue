<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const encodeInput = ref('https://it-tools.haokudelei.com');
const encodeOutput = computed(() => withDefaultOnError(() => encodeURIComponent(encodeInput.value), ''));

const encodedValidation = useValidation({
  source: encodeInput,
  rules: [
    {
      validator: value => isNotThrowing(() => encodeURIComponent(value)),
      message: '无法解析该字符串',
    },
  ],
});

const { copy: copyEncoded } = useCopy({ source: encodeOutput, text: '已复制到剪贴板' });

const decodeInput = ref('https%3A%2F%2Fit-tools.haokudelei.com');
const decodeOutput = computed(() => withDefaultOnError(() => decodeURIComponent(decodeInput.value), ''));

const decodeValidation = useValidation({
  source: encodeInput,
  rules: [
    {
      validator: value => isNotThrowing(() => decodeURIComponent(value)),
      message: '无法解析该字符串',
    },
  ],
});

const { copy: copyDecoded } = useCopy({ source: decodeOutput, text: '已复制到剪贴板' });
</script>

<template>
  <c-card title="URL编码">
    <c-input-text
      v-model:value="encodeInput"
      label="URL字符串:"
      :validation="encodedValidation"
      multiline
      autosize
      placeholder="URL字符串"
      rows="2"
      mb-3
    />

    <c-input-text
      label="已编码的URL字符串:"
      :value="encodeOutput"
      multiline
      autosize
      readonly
      placeholder="已编码的URL字符串"
      rows="2"
      mb-3
    />

    <div flex justify-center>
      <c-button @click="copyEncoded()">
        复制
      </c-button>
    </div>
  </c-card>
  <c-card title="URL解码">
    <c-input-text
      v-model:value="decodeInput"
      label="URL字符串:"
      :validation="decodeValidation"
      multiline
      autosize
      placeholder="URL字符串"
      rows="2"
      mb-3
    />

    <c-input-text
      label="已解码的URL字符串:"
      :value="decodeOutput"
      multiline
      autosize
      readonly
      placeholder="已解码的URL字符串"
      rows="2"
      mb-3
    />

    <div flex justify-center>
      <c-button @click="copyDecoded()">
        复制
      </c-button>
    </div>
  </c-card>
</template>
