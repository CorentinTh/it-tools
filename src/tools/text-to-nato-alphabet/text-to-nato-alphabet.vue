<script setup lang="ts">
import { textToNatoAlphabet } from './text-to-nato-alphabet.service';
import { useCopy } from '@/composable/copy';

const input = ref('');
const natoText = computed(() => textToNatoAlphabet({ text: input.value }));
const { copy } = useCopy({ source: natoText, text: 'NATO alphabet string copied.' });
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-card title="Input">
      <c-input-text
        v-model:value="input"
        label="Text to convert to the NATO phonetic alphabet"
        placeholder="Put your text here..."
        clearable
      />
    </c-card>

    <c-card v-if="natoText" title="NATO phonetic alphabet">
      <output>{{ natoText }}</output>
      <div class="c-generator-actions mt-4">
        <c-button autofocus @click="copy()">
          Copy NATO string
        </c-button>
      </div>
    </c-card>
  </div>
</template>
