<script setup lang="ts">
import { convertTextToUnicode, convertUnicodeToText } from './text-to-unicode.service';
import { useCopy } from '@/composable/copy';

const inputText = ref('');
const unicodeFromText = computed(() => inputText.value.trim() === '' ? '' : convertTextToUnicode(inputText.value));
const { copy: copyUnicode } = useCopy({ source: unicodeFromText });

const inputUnicode = ref('');
const textFromUnicode = computed(() => inputUnicode.value.trim() === '' ? '' : convertUnicodeToText(inputUnicode.value));
const { copy: copyText } = useCopy({ source: textFromUnicode });
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-card title="Text to Unicode">
      <c-input-text
        v-model:value="inputText"
        label="Enter text to convert to unicode"
        placeholder="e.g. 'Hello Avengers'"
        test-id="text-to-unicode-input"
        :autosize="true"
        :autofocus="true"
        :multiline="true"
        :raw-text="true"
      />
      <c-input-text
        v-model:value="unicodeFromText"
        class="mt-2"
        label="Unicode from your text"
        placeholder="The unicode representation of your text will be here"
        test-id="text-to-unicode-output"
        :multiline="true"
        :raw-text="true"
        :readonly="true"
      />
      <div mt-2 flex justify-center>
        <c-button :disabled="!unicodeFromText" @click="copyUnicode()">
          Copy unicode to clipboard
        </c-button>
      </div>
    </c-card>

    <c-card title="Unicode to Text">
      <c-input-text
        v-model:value="inputUnicode"
        label="Enter unicode to convert to text"
        placeholder="Input Unicode"
        test-id="unicode-to-text-input"
        :autosize="true"
        :multiline="true"
        :raw-text="true"
      />
      <c-input-text
        v-model:value="textFromUnicode"
        class="mt-2"
        label="Text from your Unicode"
        placeholder="The text representation of your unicode will be here"
        test-id="unicode-to-text-output"
        :multiline="true"
        :raw-text="true"
        :readonly="true"
      />
      <div mt-2 flex justify-center>
        <c-button :disabled="!textFromUnicode" @click="copyText()">
          Copy text to clipboard
        </c-button>
      </div>
    </c-card>
  </div>
</template>
