<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { base64ToText, isValidBase64, textToBase64 } from '@/utils/base64';
import { withDefaultOnError } from '@/utils/defaults';

const encodeUrlSafe = useStorage('base64-string-converter--encode-url-safe', false);
const decodeUrlSafe = useStorage('base64-string-converter--decode-url-safe', false);

const { t } = useI18n();

const textInput = ref('');
const base64Output = computed(() => textToBase64(textInput.value, { makeUrlSafe: encodeUrlSafe.value }));
const { copy: copyTextBase64 } = useCopy({ source: base64Output, text: t('tools.base64-string-converter.base64Copied') });

const base64Input = ref('');
const textOutput = computed(() =>
  withDefaultOnError(() => base64ToText(base64Input.value.trim(), { makeUrlSafe: decodeUrlSafe.value }), ''),
);
const { copy: copyText } = useCopy({ source: textOutput, text: t('tools.base64-string-converter.stringCopied') });
const b64ValidationRules = [
  {
    message: t('tools.base64-string-converter.base64InvalidMessage'),
    validator: (value: string) => isValidBase64(value.trim(), { makeUrlSafe: decodeUrlSafe.value }),
  },
];
const b64ValidationWatch = [decodeUrlSafe];
</script>

<template>
  <c-card :title="t('tools.base64-string-converter.stringToBase64.title')">
    <n-form-item :label="t('tools.base64-string-converter.stringToBase64.encodeUrl')" label-placement="left">
      <n-switch v-model:value="encodeUrlSafe" />
    </n-form-item>
    <c-input-text
      v-model:value="textInput"
      multiline
      :placeholder="t('tools.base64-string-converter.stringToBase64.inputPlaceholder')"
      rows="5"
      :label="t('tools.base64-string-converter.stringToBase64.inputLabel')"
      raw-text
      mb-5
    />

    <c-input-text
      :label="t('tools.base64-string-converter.stringToBase64.outputLabel')"
      :value="base64Output"
      multiline
      readonly
      :placeholder="t('tools.base64-string-converter.stringToBase64.outputPlaceholder')"
      rows="5"
      mb-5
    />

    <div flex justify-center>
      <c-button @click="copyTextBase64()">
        {{ t('tools.base64-string-converter.buttons.copyBase64') }}
      </c-button>
    </div>
  </c-card>

  <c-card :title="t('tools.base64-string-converter.base64ToString.title')">
    <n-form-item :label="t('tools.base64-string-converter.base64ToString.decodeUrl')" label-placement="left">
      <n-switch v-model:value="decodeUrlSafe" />
    </n-form-item>
    <c-input-text
      v-model:value="base64Input"
      multiline
      :placeholder="t('tools.base64-string-converter.base64ToString.inputPlaceholder')"
      rows="5"
      :validation-rules="b64ValidationRules"
      :validation-watch="b64ValidationWatch"
      :label="t('tools.base64-string-converter.base64ToString.inputPlaceholder')"
      mb-5
    />

    <c-input-text
      v-model:value="textOutput"
      :label="t('tools.base64-string-converter.base64ToString.outputLabel')"
      :placeholder="t('tools.base64-string-converter.base64ToString.outputPlaceholder')"
      multiline
      rows="5"
      readonly
      mb-5
    />

    <div flex justify-center>
      <c-button @click="copyText()">
        {{ t('tools.base64-string-converter.buttons.copyDecodedString') }}
      </c-button>
    </div>
  </c-card>
</template>
