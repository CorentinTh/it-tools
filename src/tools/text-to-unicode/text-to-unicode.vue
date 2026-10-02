<script setup lang="ts">
import { convertTextToUnicode, convertTextToUnicodeEscape, convertUnicodeEscapeToText, convertUnicodeToText } from './text-to-unicode.service';
import { useCopy } from '@/composable/copy';

const inputText = ref('');
const unicodeFromText = computed(() => inputText.value.trim() === '' ? '' : convertTextToUnicode(inputText.value));
const { copy: copyUnicode } = useCopy({ source: unicodeFromText });

const inputUnicode = ref('');
const textFromUnicode = computed(() => inputUnicode.value.trim() === '' ? '' : convertUnicodeToText(inputUnicode.value));
const { copy: copyText } = useCopy({ source: textFromUnicode });

const inputEscapes = ref('');
const escapesFromText = computed(() => inputText.value.trim() === '' ? '' : convertTextToUnicodeEscape(inputText.value));
const textFromEscapes = computed(() => inputEscapes.value.trim() === '' ? '' : convertUnicodeEscapeToText(inputEscapes.value));
</script>

<template>
  <c-card title="Text to Unicode">
    <c-input-text v-model:value="inputText" placeholder="e.g. 'Hello Avengers'" label="Enter text to convert to unicode" autosize autofocus raw-text multiline test-id="text-to-unicode-input" />
    <c-input-text v-model:value="unicodeFromText" label="Unicode from your text" multiline raw-text readonly mt-2 placeholder="The unicode representation of your text will be here" test-id="text-to-unicode-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!unicodeFromText" @click="copyUnicode()">
        Copy unicode to clipboard
      </c-button>
    </div>
  </c-card>

  <c-card title="Unicode to Text">
    <c-input-text v-model:value="inputUnicode" multiline placeholder="Input Unicode" label="Enter unicode to convert to text" autosize raw-text test-id="unicode-to-text-input" />
    <c-input-text v-model:value="textFromUnicode" label="Text from your Unicode" multiline raw-text readonly mt-2 placeholder="The text representation of your unicode will be here" test-id="unicode-to-text-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!textFromUnicode" @click="copyText()">
        Copy text to clipboard
      </c-button>
    </div>
  </c-card>

  <c-card title="Text to u-escapes and back">
    <c-input-text v-model:value="inputText" multiline placeholder="e.g. 'Hello'" label="Enter text to convert to u-escapes" autosize raw-text mb-2 />
    <c-input-text :value="escapesFromText" label="u-escaped form" multiline raw-text readonly mt-2 placeholder="The escaped representation of your text will be here" />
    <c-input-text v-model:value="inputEscapes" multiline placeholder="Input u-escapes" label="Enter u-escapes to convert to text" autosize raw-text mt-2 />
    <c-input-text :value="textFromEscapes" label="Text from u-escapes" multiline raw-text readonly mt-2 placeholder="The text representation of your escapes will be here" />
  </c-card>
</template>
