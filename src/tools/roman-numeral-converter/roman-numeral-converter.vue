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

const { t } = useI18n();

const inputNumeral = ref(42);
const outputRoman = computed(() => arabicToRoman(inputNumeral.value));

const { attrs: validationNumeral } = useValidation({
  source: inputNumeral,
  rules: [
    {
      validator: value => value >= MIN_ARABIC_TO_ROMAN && value <= MAX_ARABIC_TO_ROMAN,
      message: t('tools.roman-numeral-converter.validationNumeral', { min: MIN_ARABIC_TO_ROMAN.toLocaleString(), max: MAX_ARABIC_TO_ROMAN.toLocaleString() }),
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
      message: t('tools.roman-numeral-converter.validationRoman'),
    },
  ],
});

const { copy: copyRoman } = useCopy({ source: outputRoman, text: t('tools.roman-numeral-converter.copyRoman') });
const { copy: copyArabic } = useCopy({ source: () => String(outputNumeral), text: t('tools.roman-numeral-converter.copyArabic') });
</script>

<template>
  <div>
    <c-card :title="t('tools.roman-numeral-converter.arabicToRoman')">
      <div flex items-center justify-between>
        <n-form-item v-bind="validationNumeral as any">
          <n-input-number v-model:value="inputNumeral" :min="1" style="width: 200px" :show-button="false" />
        </n-form-item>
        <div class="result">
          {{ outputRoman }}
        </div>
        <c-button autofocus :disabled="validationNumeral.validationStatus === 'error'" @click="copyRoman()">
          {{ t('tools.roman-numeral-converter.copy') }}
        </c-button>
      </div>
    </c-card>
    <c-card :title="t('tools.roman-numeral-converter.romanToArabic')" mt-5>
      <div flex items-center justify-between>
        <c-input-text v-model:value="inputRoman" style="width: 200px" :validation="validationRoman" />

        <div class="result">
          {{ outputNumeral }}
        </div>
        <c-button :disabled="!validationRoman.isValid" @click="copyArabic()">
          {{ t('tools.roman-numeral-converter.copy') }}
        </c-button>
      </div>
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.result {
  font-size: 22px;
}
</style>
