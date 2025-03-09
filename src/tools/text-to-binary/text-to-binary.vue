<script setup lang="ts">
import { type EncodingBase, convertTextToUtf8Binary, convertUtf8BinaryToText } from './text-to-binary.models';
import { withDefaultOnError } from '@/utils/defaults';
import { useCopy } from '@/composable/copy';
import { isNotThrowing } from '@/utils/boolean';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const base = useQueryParamOrStorage({ name: 'base', storageName: 'txt-bin:base', defaultValue: '2' });
const inputText = ref('');
const binaryFromText = computed(() => convertTextToUtf8Binary(inputText.value, { base: Number(base.value) as EncodingBase }));
const { copy: copyBinary } = useCopy({ source: binaryFromText });

const inputBinary = ref('');
const textFromBinary = computed(() => withDefaultOnError(() => convertUtf8BinaryToText(inputBinary.value, { base: Number(base.value) as EncodingBase }), ''));
const inputBinaryValidationRules = [
  {
    validator: (value: string) => isNotThrowing(() => convertUtf8BinaryToText(value)),
    message: 'Binary should be a valid UTF-8 binary string with multiples of 8 bits',
  },
];
const { copy: copyText } = useCopy({ source: textFromBinary });
</script>

<template>
  <div>
    <c-select
      v-model:value="base"
      label="Conversion Base:"
      label-position="left"
      mb-2
      :options="[
        { value: '2', label: 'Binary' },
        { value: '8', label: 'Octal' },
        { value: '10', label: 'Decimal' },
        { value: '16', label: 'Hexadecimal' },
      ]"
    />

    <c-card title="Text to UTF-8 binary">
      <c-input-text
        v-model:value="inputText"
        multiline
        placeholder="e.g. 'Hello world'"
        label="Enter text to convert to binary"
        autosize
        autofocus
        raw-text
        test-id="text-to-binary-input"
      />
      <c-input-text
        v-model:value="binaryFromText"
        label="Binary from your text"
        multiline
        raw-text
        readonly
        mt-2
        placeholder="The binary representation of your text will be here"
        test-id="text-to-binary-output"
      />
      <div mt-2 flex justify-center>
        <c-button :disabled="!binaryFromText" @click="copyBinary()">
          Copy binary to clipboard
        </c-button>
      </div>
    </c-card>

    <c-card title="UTF-8 binary to text">
      <c-input-text
        v-model:value="inputBinary"
        multiline
        placeholder="e.g. '01001000 01100101 01101100 01101100 01101111'"
        label="Enter binary to convert to text"
        autosize
        raw-text
        :validation-rules="inputBinaryValidationRules"
        test-id="binary-to-text-input"
      />
      <c-input-text
        v-model:value="textFromBinary"
        label="Text from your binary"
        multiline
        raw-text
        readonly
        mt-2
        placeholder="The text representation of your binary will be here"
        test-id="binary-to-text-output"
      />
      <div mt-2 flex justify-center>
        <c-button :disabled="!textFromBinary" @click="copyText()">
          Copy text to clipboard
        </c-button>
      </div>
    </c-card>
  </div>
</template>
