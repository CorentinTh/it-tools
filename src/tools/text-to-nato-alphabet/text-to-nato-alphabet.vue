<script setup lang="ts">
import { textToNatoAlphabet } from './text-to-nato-alphabet.service';
import { allLanguagesAndCountries } from './text-to-nato-alphabet.constants';
import { useCopy } from '@/composable/copy';

const lang = useStorage('text-to-nato:lang', '(International)');
const input = ref('');
const natoText = computed(() => textToNatoAlphabet({ text: input.value, langOrCountry: lang.value }));
const { copy } = useCopy({ source: natoText, text: 'NATO alphabet string copied.' });
</script>

<template>
  <div>
    <c-select
      v-model:value="lang"
      :options="allLanguagesAndCountries"
      searchable
    />

    <c-input-text
      v-model:value="input"
      label="Your text to convert to NATO phonetic alphabet"
      placeholder="Put your text here..."
      clearable
      mb-5
    />

    <div v-if="natoText">
      <div mb-2>
        Your text in NATO phonetic alphabet ({{ lang }})
      </div>
      <c-card>
        {{ natoText }}
      </c-card>

      <div mt-3 flex justify-center>
        <c-button autofocus @click="copy()">
          Copy NATO string
        </c-button>
      </div>
    </div>
  </div>
</template>
