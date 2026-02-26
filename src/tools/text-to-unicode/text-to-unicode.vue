<script setup lang="ts">
import { convertTextToUnicode, convertTextToUnicodeHex, convertUnicodeToText } from './text-to-unicode.service';
import InputCopyable from '@/components/InputCopyable.vue';

const { t } = useI18n();

const inputText = ref('');
const unicodeFromText = computed(() => inputText.value.trim() === '' ? '' : convertTextToUnicode(inputText.value));
const unicodeFromTextHex = computed(() => inputText.value.trim() === '' ? '' : convertTextToUnicodeHex(inputText.value));

const inputUnicode = ref('');
const textFromUnicode = computed(() => inputUnicode.value.trim() === '' ? '' : convertUnicodeToText(inputUnicode.value));
</script>

<template>
  <c-card :title="t('tools.text-to-unicode.textToUnicode.cardTitle')">
    <c-input-text
      v-model:value="inputText"
      multiline
      :placeholder="t('tools.text-to-unicode.textToUnicode.inputPlaceholder')"
      :label="t('tools.text-to-unicode.textToUnicode.inputLabel')"
      autosize
      autofocus
      raw-text
      test-id="text-to-unicode-input"
    />
    <InputCopyable
      :value="unicodeFromText"
      :label="t('tools.text-to-unicode.textToUnicode.outputLabelHtml')"
      multiline
      raw-text
      readonly
      mt-2
      :placeholder="t('tools.text-to-unicode.textToUnicode.outputPlaceholder')"
      test-id="text-to-unicode-output"
    />
    <InputCopyable
      :value="unicodeFromTextHex"
      :label="t('tools.text-to-unicode.textToUnicode.outputLabelU')"
      multiline
      raw-text
      readonly
      mt-2
      :placeholder="t('tools.text-to-unicode.textToUnicode.outputPlaceholder')"
      test-id="text-to-unicode-output-hex"
    />
  </c-card>

  <c-card :title="t('tools.text-to-unicode.unicodeToText.cardTitle')">
    <c-input-text
      v-model:value="inputUnicode"
      multiline
      :placeholder="t('tools.text-to-unicode.unicodeToText.inputPlaceholder')"
      :label="t('tools.text-to-unicode.unicodeToText.inputLabel')"
      autosize
      raw-text
      test-id="unicode-to-text-input"
    />
    <InputCopyable
      :value="textFromUnicode"
      :label="t('tools.text-to-unicode.unicodeToText.outputLabel')"
      multiline
      raw-text
      readonly
      mt-2
      :placeholder="t('tools.text-to-unicode.unicodeToText.outputPlaceholder')"
      test-id="unicode-to-text-output"
    />
  </c-card>
</template>
