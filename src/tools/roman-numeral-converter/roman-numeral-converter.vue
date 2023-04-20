<template>
  <div>
    <c-card title="Arabic to roman">
      <n-space align="center" justify="space-between">
        <n-form-item v-bind="validationNumeral">
          <n-input-number v-model:value="inputNumeral" :min="1" style="width: 200px" :show-button="false" />
        </n-form-item>
        <div class="result">
          {{ outputRoman }}
        </div>
        <c-button autofocus :disabled="validationNumeral.validationStatus === 'error'" @click="copyRoman">
          Copy
        </c-button>
      </n-space>
    </c-card>
    <c-card title="Roman to arabic" mt-5>
      <n-space align="center" justify="space-between">
        <n-form-item v-bind="validationRoman">
          <n-input v-model:value="inputRoman" style="width: 200px" />
        </n-form-item>
        <div class="result">
          {{ outputNumeral }}
        </div>
        <c-button :disabled="validationRoman.validationStatus === 'error'" @click="copyArabic"> Copy </c-button>
      </n-space>
    </c-card>
  </div>
</template>

<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { ref, computed } from 'vue';
import { useValidation } from '@/composable/validation';
import {
  arabicToRoman,
  romanToArabic,
  MAX_ARABIC_TO_ROMAN,
  MIN_ARABIC_TO_ROMAN,
  isValidRomanNumber,
} from './roman-numeral-converter.service';

const inputNumeral = ref(42);
const outputRoman = computed(() => arabicToRoman(inputNumeral.value));

const { attrs: validationNumeral } = useValidation({
  source: inputNumeral,
  rules: [
    {
      validator: (value) => value >= MIN_ARABIC_TO_ROMAN && value <= MAX_ARABIC_TO_ROMAN,
      message: `We can only convert numbers between ${MIN_ARABIC_TO_ROMAN.toLocaleString()} and ${MAX_ARABIC_TO_ROMAN.toLocaleString()}`,
    },
  ],
});

const inputRoman = ref('XLII');
const outputNumeral = computed(() => romanToArabic(inputRoman.value));

const { attrs: validationRoman } = useValidation({
  source: inputRoman,
  rules: [
    {
      validator: (value) => isValidRomanNumber(value),
      message: `The input you entered is not a valid roman number`,
    },
  ],
});

const { copy: copyRoman } = useCopy({ source: outputRoman, text: 'Roman number copied to the clipboard' });
const { copy: copyArabic } = useCopy({ source: outputNumeral, text: 'Arabic number copied to the clipboard' });
</script>

<style lang="less" scoped>
.result {
  font-size: 22px;
}
</style>
