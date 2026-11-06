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
    message: 'Binary should be a valid ASCII binary string with multiples of 8 bits',
  },
];
const { copy: copyText } = useCopy({ source: textFromBinary });
</script>

<template>
  <c-card title="Text to ASCII binary">
    <c-input-text v-model:value="inputText" multiline placeholder="e.g. 'Hello world'" label="Enter text to convert to binary" autosize autofocus raw-text test-id="text-to-binary-input" />
    <c-input-text v-model:value="binaryFromText" label="Binary from your text" multiline raw-text readonly mt-2 placeholder="The binary representation of your text will be here" test-id="text-to-binary-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!binaryFromText" @click="copyBinary()">
        Copy binary to clipboard
      </c-button>
    </div>
  </c-card>

  <c-card title="ASCII binary to text">
    <c-input-text v-model:value="inputBinary" multiline placeholder="e.g. '01001000 01100101 01101100 01101100 01101111'" label="Enter binary to convert to text" autosize raw-text :validation-rules="inputBinaryValidationRules" test-id="binary-to-text-input" />
    <c-input-text v-model:value="textFromBinary" label="Text from your binary" multiline raw-text readonly mt-2 placeholder="The text representation of your binary will be here" test-id="binary-to-text-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!textFromBinary" @click="copyText()">
        Copy text to clipboard
      </c-button>
    </div>
  </c-card>
</template>
