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

const inputNumeral = ref(42);
const outputRoman = computed(() => arabicToRoman(inputNumeral.value));

const { attrs: validationNumeral } = useValidation({
  source: inputNumeral,
  rules: [
    {
      validator: value => value >= MIN_ARABIC_TO_ROMAN && value <= MAX_ARABIC_TO_ROMAN,
      message: `只能转换 ${MIN_ARABIC_TO_ROMAN.toLocaleString()} 到 ${MAX_ARABIC_TO_ROMAN.toLocaleString()} 之间的数字`,
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
      message: '无效的罗马数字',
    },
  ],
});

const { copy: copyRoman } = useCopy({ source: outputRoman, text: '罗马数字已复制到剪贴板' });
const { copy: copyArabic } = useCopy({ source: () => String(outputNumeral), text: '阿拉伯数字已复制到剪贴板' });
</script>

<template>
  <div>
    <c-card title="阿拉伯数字 转 罗马数字">
      <div flex items-center justify-between>
        <n-form-item v-bind="validationNumeral as any">
          <n-input-number v-model:value="inputNumeral" :min="1" style="width: 200px" :show-button="false" />
        </n-form-item>
        <div class="result">
          {{ outputRoman }}
        </div>
        <c-button autofocus :disabled="validationNumeral.validationStatus === 'error'" @click="copyRoman()">
          复制
        </c-button>
      </div>
    </c-card>
    <c-card title="罗马数字 转 阿拉伯数字" mt-5>
      <div flex items-center justify-between>
        <c-input-text v-model:value="inputRoman" style="width: 200px" :validation="validationRoman" />

        <div class="result">
          {{ outputNumeral }}
        </div>
        <c-button :disabled="!validationRoman.isValid" @click="copyArabic()">
          复制
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
