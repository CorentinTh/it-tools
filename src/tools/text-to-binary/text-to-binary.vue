<script setup lang="ts">
import { convertAsciiBinaryToText, convertTextToAsciiBinary, convertTextToUnicodeBinary, convertTextToUtf8Binary, convertUnicodeBinaryToText, convertUtf8BinaryToText } from './text-to-binary.models';
import { withDefaultOnError } from '@/utils/defaults';
import { useCopy } from '@/composable/copy';
import { isNotThrowing } from '@/utils/boolean';

const inputAsciiText = ref('');
const binaryAsciiFromText = computed(() => convertTextToAsciiBinary(inputAsciiText.value));
const { copy: copyAsciiBinary } = useCopy({ source: binaryAsciiFromText });

const inputAsciiBinary = ref('');
const textFromAsciiBinary = computed(() => withDefaultOnError(() => convertAsciiBinaryToText(inputAsciiBinary.value), ''));
const inputAsciiBinaryValidationRules = [
  {
    validator: (value: string) => isNotThrowing(() => convertAsciiBinaryToText(value)),
    message: 'Binary should be a valid ASCII binary string with multiples of 8 bits',
  },
];
const { copy: copyAsciiText } = useCopy({ source: textFromAsciiBinary });

const inputUnicodeText = ref('');
const binaryUnicodeFromText = computed(() => convertTextToUnicodeBinary(inputUnicodeText.value));
const { copy: copyUnicodeBinary } = useCopy({ source: binaryUnicodeFromText });

const inputUnicodeBinary = ref('');
const textFromUnicodeBinary = computed(() => withDefaultOnError(() => convertUnicodeBinaryToText(inputUnicodeBinary.value), ''));
const inputUnicodeBinaryValidationRules = [
  {
    validator: (value: string) => isNotThrowing(() => convertUnicodeBinaryToText(value)),
    message: 'Binary should be a valid Unicode binary string with multiples of 8 bits',
  },
];
const { copy: copyUnicodeText } = useCopy({ source: textFromUnicodeBinary });

const inputUtf8Text = ref('');
const binaryUtf8FromText = computed(() => convertTextToUtf8Binary(inputUtf8Text.value));
const { copy: copyUtf8Binary } = useCopy({ source: binaryUtf8FromText });

const inputUtf8Binary = ref('');
const textFromUtf8Binary = computed(() => withDefaultOnError(() => convertUtf8BinaryToText(inputUtf8Binary.value), ''));
const inputUtf8BinaryValidationRules = [
  {
    validator: (value: string) => isNotThrowing(() => convertUtf8BinaryToText(value)),
    message: 'Binary should be a valid Utf8 binary string with multiples of 8 bits',
  },
];
const { copy: copyUtf8Text } = useCopy({ source: textFromUtf8Binary });
</script>

<template>
  <c-card title="Text to ASCII binary">
    <c-input-text v-model:value="inputAsciiText" multiline placeholder="e.g. 'Hello world'" label="Enter text to convert to binary" autosize autofocus raw-text test-id="text-to-binary-input" />
    <c-input-text v-model:value="binaryAsciiFromText" label="Binary from your text" multiline raw-text readonly mt-2 placeholder="The binary representation of your text will be here" test-id="text-to-binary-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!binaryAsciiFromText" @click="copyAsciiBinary()">
        Copy binary to clipboard
      </c-button>
    </div>
  </c-card>

  <c-card title="ASCII binary to text">
    <c-input-text v-model:value="inputAsciiBinary" multiline placeholder="e.g. '01001000 01100101 01101100 01101100 01101111'" label="Enter binary to convert to text" autosize raw-text :validation-rules="inputAsciiBinaryValidationRules" test-id="binary-to-text-input" />
    <c-input-text v-model:value="textFromAsciiBinary" label="Text from your binary" multiline raw-text readonly mt-2 placeholder="The text representation of your binary will be here" test-id="binary-to-text-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!textFromAsciiBinary" @click="copyAsciiText()">
        Copy text to clipboard
      </c-button>
    </div>
  </c-card>
  <c-card title="Text to Unicode binary">
    <c-input-text v-model:value="inputUnicodeText" multiline placeholder="e.g. '这是一些中文字'" label="Enter text to convert to binary" autosize autofocus raw-text test-id="text-to-binary-input" />
    <c-input-text v-model:value="binaryUnicodeFromText" label="Binary from your text" multiline raw-text readonly mt-2 placeholder="The binary representation of your text will be here" test-id="text-to-binary-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!binaryUnicodeFromText" @click="copyUnicodeBinary()">
        Copy binary to clipboard
      </c-button>
    </div>
  </c-card>
  <c-card title="Unicode binary to text">
    <c-input-text v-model:value="inputUnicodeBinary" multiline placeholder="e.g. '\u8fd9\u662f\u4e00\u4e9b\u4e2d\u6587\u5b57aa\u6240123\u4e0d'" label="Enter binary to convert to text" autosize raw-text :validation-rules="inputUnicodeBinaryValidationRules" test-id="binary-to-text-input" />
    <c-input-text v-model:value="textFromUnicodeBinary" label="Text from your binary" multiline raw-text readonly mt-2 placeholder="The text representation of your binary will be here" test-id="binary-to-text-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!textFromUnicodeBinary" @click="copyUnicodeText()">
        Copy text to clipboard
      </c-button>
    </div>
  </c-card>

  <c-card title="Text to Utf8 binary">
    <c-input-text v-model:value="inputUtf8Text" multiline placeholder="e.g. '这是一些中文字'" label="Enter text to convert to binary" autosize autofocus raw-text test-id="text-to-binary-input" />
    <c-input-text v-model:value="binaryUtf8FromText" label="Binary from your text" multiline raw-text readonly mt-2 placeholder="The binary representation of your text will be here" test-id="text-to-binary-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!binaryUtf8FromText" @click="copyUtf8Binary()">
        Copy binary to clipboard
      </c-button>
    </div>
  </c-card>
  <c-card title="Utf8 binary to text">
    <c-input-text v-model:value="inputUtf8Binary" multiline placeholder="e.g. '&amp;#x8FD9;&amp;#x662F;&amp;#x4E00;&amp;#x4E9B;&amp;#x4E2D;&amp;#x6587;&amp;#x5B57;'" label="Enter binary to convert to text" autosize raw-text :validation-rules="inputUtf8BinaryValidationRules" test-id="binary-to-text-input" />
    <c-input-text v-model:value="textFromUtf8Binary" label="Text from your binary" multiline raw-text readonly mt-2 placeholder="The text representation of your binary will be here" test-id="binary-to-text-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!textFromUtf8Binary" @click="copyUtf8Text()">
        Copy text to clipboard
      </c-button>
    </div>
  </c-card>
</template>
