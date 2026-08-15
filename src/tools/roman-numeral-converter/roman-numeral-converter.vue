<script setup lang="ts">
import {
  MAX_ARABIC_TO_ROMAN,
  MIN_ARABIC_TO_ROMAN,
  arabicToRoman,
  isValidRomanNumber,
  romanToArabic,
} from './roman-numeral-converter.service';
import { useCopy } from '@/composable/copy';
import { useValidation } from '@/composable/validation';
import CInputNumber from '@/ui/c-input-number/c-input-number.vue';

const inputNumeral = ref(42);
const outputRoman = computed(() => arabicToRoman(inputNumeral.value));

const validationNumeral = useValidation({
  source: inputNumeral,
  rules: [
    {
      validator: value => value >= MIN_ARABIC_TO_ROMAN && value <= MAX_ARABIC_TO_ROMAN,
      message: `We can only convert numbers between ${MIN_ARABIC_TO_ROMAN.toLocaleString()} and ${MAX_ARABIC_TO_ROMAN.toLocaleString()}`,
    },
  ],
});

const inputRoman = ref('XLII');
const outputNumeral = computed(() => romanToArabic(inputRoman.value));

const validationRoman = useValidation({
  source: inputRoman,
  rules: [
    {
      validator: value => isValidRomanNumber(value),
      message: 'The input you entered is not a valid roman number',
    },
  ],
});

const { copy: copyRoman } = useCopy({ source: outputRoman, text: 'Roman number copied to the clipboard' });
const { copy: copyArabic } = useCopy({ source: () => String(outputNumeral), text: 'Arabic number copied to the clipboard' });
</script>

<template>
  <div class="c-form-layout">
    <c-card title="Arabic to roman">
      <div grid grid-cols-1 items-end gap-3 md:grid-cols-3>
        <c-field
          label="Arabic number"
          label-for="roman-arabic-input"
          :feedback="validationNumeral.message"
          :status="validationNumeral.isValid ? 'default' : 'error'"
          reserve-feedback
        >
          <CInputNumber id="roman-arabic-input" v-model:value="inputNumeral" :min="MIN_ARABIC_TO_ROMAN" :max="MAX_ARABIC_TO_ROMAN" :show-button="false" />
        </c-field>
        <c-input-text :value="outputRoman" label="Roman numeral" readonly raw-text monospace />
        <c-button :disabled="!validationNumeral.isValid" @click="copyRoman()">
          Copy
        </c-button>
      </div>
    </c-card>
    <c-card title="Roman to arabic">
      <div grid grid-cols-1 items-end gap-3 md:grid-cols-3>
        <c-input-text v-model:value="inputRoman" label="Roman numeral" :validation="validationRoman" raw-text monospace />
        <c-input-text :value="String(outputNumeral)" label="Arabic number" readonly raw-text />
        <c-button :disabled="!validationRoman.isValid" @click="copyArabic()">
          Copy
        </c-button>
      </div>
    </c-card>
  </div>
</template>
