<script setup lang="ts">
import { convertAsciiBinaryToText, convertTextToAsciiBinary } from './text-to-binary.models';
import { withDefaultOnError } from '@/utils/defaults';
import { useCopy } from '@/composable/copy';
import { isNotThrowing } from '@/utils/boolean';

const inputText = ref('');
const binaryFromText = computed(() => convertTextToAsciiBinary(inputText.value));
const { copy: copyBinary } = useCopy({ source: binaryFromText });

const inputBinary = ref('');
const textFromBinary = computed(() => withDefaultOnError(() => convertAsciiBinaryToText(inputBinary.value), ''));
const inputBinaryValidationRules = [
  {
    validator: (value: string) => isNotThrowing(() => convertAsciiBinaryToText(value)),
    message: '格式错误：应该是ASCII二进制字符串，且长度是8的倍数',
  },
];
const { copy: copyText } = useCopy({ source: textFromBinary });
</script>

<template>
  <c-card title="文本 转 ASCII二进制">
    <c-input-text v-model:value="inputText" multiline placeholder="输入文本" label="文本" autosize autofocus raw-text test-id="text-to-binary-input" />
    <c-input-text v-model:value="binaryFromText" label="ASCII二进制" multiline raw-text readonly mt-2 placeholder="转换后的ASCII二进制" test-id="text-to-binary-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!binaryFromText" @click="copyBinary()">
        复制到剪贴板
      </c-button>
    </div>
  </c-card>

  <c-card title="ASCII二进制 转 文本">
    <c-input-text v-model:value="inputBinary" multiline placeholder="输入ASCII二进制，例：01001000 01100101 01101100 01101100 01101111" label="ASCII二进制" autosize raw-text :validation-rules="inputBinaryValidationRules" test-id="binary-to-text-input" />
    <c-input-text v-model:value="textFromBinary" label="文本" multiline raw-text readonly mt-2 placeholder="转换后的文本" test-id="binary-to-text-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!textFromBinary" @click="copyText()">
        复制到剪贴板
      </c-button>
    </div>
  </c-card>
</template>
