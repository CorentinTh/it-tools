<template>
  <div>
    <c-input-text
      v-model:value="input"
      label="Your text to convert to NATO phonetic alphabet"
      placeholder="Put your text here..."
      clearable
      mb-5
    />

    <n-space v-if="natoText" vertical>
      <n-text>Your text in NATO phonetic alphabet</n-text>
      <c-card>
        {{ natoText }}
      </c-card>

      <n-space justify="center">
        <c-button autofocus @click="copy"> Copy NATO string </c-button>
      </n-space>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { computed, ref } from 'vue';
import { textToNatoAlphabet } from './text-to-nato-alphabet.service';

const input = ref('');
const natoText = computed(() => textToNatoAlphabet({ text: input.value }));
const { copy } = useCopy({ source: natoText, text: 'NATO alphabet string copied.' });
</script>

<style lang="less" scoped></style>
