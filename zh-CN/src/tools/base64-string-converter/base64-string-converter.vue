<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { base64ToText, isValidBase64, textToBase64 } from '@/utils/base64';
import { withDefaultOnError } from '@/utils/defaults';

const encodeUrlSafe = useStorage('base64-string-converter--encode-url-safe', false);
const decodeUrlSafe = useStorage('base64-string-converter--decode-url-safe', false);

const textInput = ref('');
const base64Output = computed(() => textToBase64(textInput.value, { makeUrlSafe: encodeUrlSafe.value }));
const { copy: copyTextBase64 } = useCopy({ source: base64Output, text: '已复制到剪贴板' });

const base64Input = ref('');
const textOutput = computed(() =>
  withDefaultOnError(() => base64ToText(base64Input.value.trim(), { makeUrlSafe: decodeUrlSafe.value }), ''),
);
const { copy: copyText } = useCopy({ source: textOutput, text: '已复制到剪贴板' });
const b64ValidationRules = [
  {
    message: '无效的Base64字符串',
    validator: (value: string) => isValidBase64(value.trim(), { makeUrlSafe: decodeUrlSafe.value }),
  },
];
const b64ValidationWatch = [decodeUrlSafe];
</script>

<template>
  <c-card title="字符串 转 Base64">
    <n-form-item label="对URL进行编码" label-placement="left">
      <n-switch v-model:value="encodeUrlSafe" />
    </n-form-item>
    <c-input-text
      v-model:value="textInput"
      multiline
      placeholder="把字符串放在这里"
      rows="5"
      label="准备转换的字符串"
      raw-text
      mb-5
    />

    <c-input-text
      label="转换结果（Base64）"
      :value="base64Output"
      multiline
      readonly
      placeholder="转换结果将在这里显示"
      rows="5"
      mb-5
    />

    <div flex justify-center>
      <c-button @click="copyTextBase64()">
        复制
      </c-button>
    </div>
  </c-card>

  <c-card title="Base64 转 字符串">
    <n-form-item label="对URL进行解码" label-placement="left">
      <n-switch v-model:value="decodeUrlSafe" />
    </n-form-item>
    <c-input-text
      v-model:value="base64Input"
      multiline
      placeholder="把Base64放在这里"
      rows="5"
      :validation-rules="b64ValidationRules"
      :validation-watch="b64ValidationWatch"
      label="准备转换的Base64"
      mb-5
    />

    <c-input-text
      v-model:value="textOutput"
      label="转换结果（字符串）"
      placeholder="转换结果将在这里显示"
      multiline
      rows="5"
      readonly
      mb-5
    />

    <div flex justify-center>
      <c-button @click="copyText()">
        复制
      </c-button>
    </div>
  </c-card>
</template>
