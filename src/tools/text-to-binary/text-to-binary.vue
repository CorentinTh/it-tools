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
  <div class="c-tool-workbench c-tool-stack">
    <c-card title="Text to ASCII binary">
      <c-input-text
        v-model:value="inputText"
        label="Enter text to convert to binary"
        placeholder="e.g. 'Hello world'"
        test-id="text-to-binary-input"
        :autosize="true"
        :autofocus="true"
        :multiline="true"
        :raw-text="true"
      />
      <c-input-text
        v-model:value="binaryFromText"
        class="mt-2"
        label="Binary from your text"
        placeholder="The binary representation of your text will be here"
        test-id="text-to-binary-output"
        :multiline="true"
        :raw-text="true"
        :readonly="true"
      />
      <div mt-2 flex justify-center>
        <c-button :disabled="!binaryFromText" @click="copyBinary()">
          Copy binary to clipboard
        </c-button>
      </div>
    </c-card>

    <c-card title="ASCII binary to text">
      <c-input-text
        v-model:value="inputBinary"
        label="Enter binary to convert to text"
        placeholder="e.g. '01001000 01100101 01101100 01101100 01101111'"
        test-id="binary-to-text-input"
        :autosize="true"
        :multiline="true"
        :raw-text="true"
        :validation-rules="inputBinaryValidationRules"
      />
      <c-input-text
        v-model:value="textFromBinary"
        class="mt-2"
        label="Text from your binary"
        placeholder="The text representation of your binary will be here"
        test-id="binary-to-text-output"
        :multiline="true"
        :raw-text="true"
        :readonly="true"
      />
      <div mt-2 flex justify-center>
        <c-button :disabled="!textFromBinary" @click="copyText()">
          Copy text to clipboard
        </c-button>
      </div>
    </c-card>
  </div>
</template>
