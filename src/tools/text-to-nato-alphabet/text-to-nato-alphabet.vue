<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { spellingAlphabets } from './text-to-nato-alphabet.constants';
import { textToSpellingAlphabet } from './text-to-nato-alphabet.service';
import { useCopy } from '@/composable/copy';

const alphabetKey = useStorage('text-to-nato-alphabet:alphabet', 'nato');
const spellDigits = useStorage('text-to-nato-alphabet:spell-digits', true);

const input = ref('');
const natoText = computed(() => input.value.trim() === '' ? '' : textToSpellingAlphabet({ text: input.value, alphabetKey: alphabetKey.value, spellDigits: spellDigits.value }));
const { copy } = useCopy({ source: natoText, text: 'Spelling alphabet string copied.' });

const alphabetOptions = spellingAlphabets.map(alphabet => ({ label: alphabet.label, value: alphabet.key }));
</script>

<template>
  <div>
    <c-input-text
      v-model:value="input"
      label="Your text to convert to a spelling alphabet"
      placeholder="Put your text here..."
      clearable
      mb-3
    />

    <div flex items-center gap-4 mb-5>
      <c-select
        v-model:value="alphabetKey"
        label="Spelling alphabet"
        label-position="left"
        label-width="140px"
        :options="alphabetOptions"
        w-full
      />
      <n-form-item label="Spell digits" label-placement="left" :show-feedback="false" mb-0>
        <n-switch v-model:value="spellDigits" />
      </n-form-item>
    </div>

    <div v-if="natoText">
      <div mb-2>
        Your text in the selected spelling alphabet
      </div>
      <c-card>
        {{ natoText }}
      </c-card>

      <div mt-3 flex justify-center>
        <c-button autofocus @click="copy()">
          Copy string
        </c-button>
      </div>
    </div>
  </div>
</template>
