<script setup lang="ts">
import { type Encoding, convertTextToUnicode, convertUnicodeToText } from './text-to-unicode.service';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { useCopy } from '@/composable/copy';

const encoding = useQueryParamOrStorage({ name: 'enc', storageName: 'txt-uni:enc', defaultValue: 'htmldec' });
const skipAscii = useQueryParamOrStorage({ name: 'skipAscii', storageName: 'txt-uni:asc', defaultValue: false });

const inputText = ref('');
const unicodeFromText = computed(() => inputText.value.trim() === ''
  ? ''
  : convertTextToUnicode(inputText.value, { encoding: encoding.value as Encoding, skipAscii: skipAscii.value }));
const { copy: copyUnicode } = useCopy({ source: unicodeFromText });

const inputUnicode = ref('');
const textFromUnicode = computed(() => inputUnicode.value.trim() === ''
  ? ''
  : convertUnicodeToText(inputUnicode.value));
const { copy: copyText } = useCopy({ source: textFromUnicode });
</script>

<template>
  <c-card title="Text to Unicode">
    <c-select
      v-model:value="encoding"
      label="Unicode encoding"
      :options="[
        { value: 'htmldec', label: 'HTML Decimal (&amp;#160;)' },
        { value: 'htmlhex', label: 'HTML Hexadecimal (&amp;#xA0;)' },
        { value: 'uniplus', label: 'U+00A0' },
        { value: 'antiuni', label: '\\u00A0' },
        { value: 'css', label: 'CSS (\\0000A0)' },
        { value: 'python', label: 'Python (\\xA0, \\u00A0, \\U100A0)' },
        { value: 'js', label: 'Python (\\u00A0; \\u{100A0})' },
        { value: 'utf16', label: 'UTF 16 (with surrogates)' },
      ]"
    />
    <n-form-item>
      <n-checkbox v-model:checked="skipAscii">
        Skip Ascii characters
      </n-checkbox>
    </n-form-item>

    <c-input-text v-model:value="inputText" multiline placeholder="e.g. 'Hello Avengers'" label="Enter text to convert to unicode" autosize autofocus raw-text test-id="text-to-unicode-input" />
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
</template>
