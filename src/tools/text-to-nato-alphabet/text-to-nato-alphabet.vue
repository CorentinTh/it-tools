<script setup lang="ts">
import { textToNatoAlphabet } from './text-to-nato-alphabet.service';
import { useCopy } from '@/composable/copy';

const { t } = useI18n();

const input = ref('');
const natoText = computed(() => textToNatoAlphabet({ text: input.value }));
const { copy } = useCopy({ source: natoText, text: t('tools.text-to-nato-alphabet.copied') });
</script>

<template>
  <div>
    <c-input-text
      v-model:value="input"
      :label="t('tools.text-to-nato-alphabet.inputLabel')"
      :placeholder="t('tools.text-to-nato-alphabet.inputPlaceholder')"
      clearable
      mb-5
    />

    <div v-if="natoText">
      <div mb-2>
        {{ t('tools.text-to-nato-alphabet.outputLabel') }}
      </div>
      <c-card>
        {{ natoText }}
      </c-card>

      <div mt-3 flex justify-center>
        <c-button autofocus @click="copy()">
          {{ t('tools.text-to-nato-alphabet.copy') }}
        </c-button>
      </div>
    </div>
  </div>
</template>
