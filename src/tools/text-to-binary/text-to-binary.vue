<script setup lang="ts">
import { convertAsciiBinaryToText, convertTextToAsciiBinary } from './text-to-binary.models';
import { withDefaultOnError } from '@/utils/defaults';
import { useCopy } from '@/composable/copy';
import { isNotThrowing } from '@/utils/boolean';

const { t } = useI18n();

const inputText = ref('');
const binaryFromText = computed(() => convertTextToAsciiBinary(inputText.value));
const { copy: copyBinary } = useCopy({ source: binaryFromText });

const inputBinary = ref('');
const textFromBinary = computed(() => withDefaultOnError(() => convertAsciiBinaryToText(inputBinary.value), ''));
const inputBinaryValidationRules = [
  {
    validator: (value: string) => isNotThrowing(() => convertAsciiBinaryToText(value)),
    message: t('tools.text-to-binary.invalidMessage'),
  },
];
const { copy: copyText } = useCopy({ source: textFromBinary });
</script>

<template>
  <c-card :title="t('tools.text-to-binary.textToBinary.title')">
    <c-input-text v-model:value="inputText" multiline :placeholder="t('tools.text-to-binary.textToBinary.inputPlaceholder')" label="t('tools.text-to-binary.textToBinary.inputLabel')" autosize autofocus raw-text test-id="text-to-binary-input" />
    <c-input-text v-model:value="binaryFromText" :label="t('tools.text-to-binary.textToBinary.outputLabel')" multiline raw-text readonly mt-2 :placeholder="t('tools.text-to-binary.textToBinary.outputPlaceholder')" test-id="text-to-binary-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!binaryFromText" @click="copyBinary()">
        {{ t('tools.text-to-binary.textToBinary.copyBinary') }}
      </c-button>
    </div>
  </c-card>

  <c-card :title="t('tools.text-to-binary.binaryToText.title')">
    <c-input-text v-model:value="inputBinary" multiline :placeholder="t('tools.text-to-binary.binaryToText.inputPlaceholder')" :label="t('tools.text-to-binary.binaryToText.inputLabel')" autosize raw-text :validation-rules="inputBinaryValidationRules" test-id="binary-to-text-input" />
    <c-input-text v-model:value="textFromBinary" :label="t('tools.text-to-binary.binaryToText.outputLabel')" multiline raw-text readonly mt-2 :placeholder="t('tools.text-to-binary.binaryToText.outputPlaceholder')" test-id="binary-to-text-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!textFromBinary" @click="copyText()">
        {{ t('tools.text-to-binary.binaryToText.copyText') }}
      </c-button>
    </div>
  </c-card>
</template>
