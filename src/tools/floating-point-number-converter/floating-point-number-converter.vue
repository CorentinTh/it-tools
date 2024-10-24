<script setup lang="ts">
import InputCopyable from '../../components/InputCopyable.vue';
import { convertBase } from '../integer-base-converter/integer-base-converter.model';
import { calcErrorDueToConversion, convertBinaryToDecimal, convertDecimalToBinary } from './floating-point-number-converter.model';
import { getErrorMessageIfThrows } from '@/utils/error';

const bitCount = ref(32);
const decimalInput = ref('42.42');
const binaryOutput = ref();
const actualValue = ref();

const binaryInput = ref('01000010001010011010111000010100');
const decimalPrecision = ref('32');
const showTrailingZeros = ref(false);

function errorlessBinaryToDecimalConversion(...args: Parameters<typeof convertBinaryToDecimal>) {
  try {
    return convertBinaryToDecimal(...args);
  }
  catch (err) {
    return '';
  }
}

const binaryToDecimalError = computed(() =>
  getErrorMessageIfThrows(() =>
    convertBinaryToDecimal({ value: binaryInput.value, decimalPrecision: decimalPrecision.value, removeZeroPadding: false }),
  ),
);
</script>

<template>
  <c-card title="Decimal to Binary" style="min-width: 650px">
    <c-input-text
      v-model:value="decimalInput"
      label="Decimal Number"
      placeholder="Put your decimal number here (ex: 42.42)"
      label-position="left"
      label-width="210px"
      label-align="right"
      mb-2
    />

    <c-select
      v-model:value="bitCount"
      mb-4
      label="Bit Count"
      label-position="left"
      label-width="210px"
      label-align="right"
      :options="[
        {
          label: '32-Bit (Single precision)',
          value: 32,
        },
        {
          label: '64-Bit (Double precision)',
          value: 64,
        },
      ]"
    />

    <n-divider />

    <InputCopyable
      label="Binary Number"
      placeholder="Binary Number"
      :value="binaryOutput = convertDecimalToBinary({ value: decimalInput, bitCount })"
      readonly
      label-position="left"
      label-width="210px"
      label-align="right"
      mb-2
    />

    <InputCopyable
      label="Hexadecimal Representation"
      placeholder="Hexadecimal Representation"
      :value="convertBase({ value: binaryOutput, fromBase: 2, toBase: 16 })"
      readonly
      label-position="left"
      label-width="210px"
      label-align="right"
      mb-2
    />

    <InputCopyable
      label="Actually stored value"
      placeholder="Actually stored value"
      :value="actualValue = errorlessBinaryToDecimalConversion({ value: binaryOutput, decimalPrecision: '32', removeZeroPadding: true })"
      readonly
      label-position="left"
      label-width="210px"
      label-align="right"
      mb-2
    />

    <InputCopyable
      label="Error due to conversion"
      placeholder="Error due to conversion"
      :value="calcErrorDueToConversion({ decimalInput, actualValue })"
      readonly
      label-position="left"
      label-width="210px"
      label-align="right"
      mb-2
    />
  </c-card>

  <c-card title="Binary to Decimal" style="min-width: 650px">
    <c-input-text
      v-model:value="binaryInput"
      label="Binary Number"
      placeholder="Put your binary number here (ex: 01000010001010011010111000010100)"
      label-position="left"
      label-width="140px"
      label-align="right"
      mb-2
    />

    <c-input-text
      v-model:value="decimalPrecision"
      label="Decimal Precision"
      placeholder="Choose the decimal precision (digits after the decimal point)."
      label-position="left"
      label-width="140px"
      label-align="right"
      mb-2
    />

    <n-form-item
      label="Show Trailing Zeros"
      label-placement="left"
      label-width="140px"
      label-align="right"
    >
      <n-switch
        v-model:value="showTrailingZeros"
      />
    </n-form-item>

    <n-alert v-if="binaryToDecimalError" style="margin-top: 25px" type="error">
      {{ binaryToDecimalError }}
    </n-alert>

    <n-divider />

    <InputCopyable
      label="Decimal Number"
      placeholder="Decimal Number"
      :value="errorlessBinaryToDecimalConversion({ value: binaryInput, decimalPrecision, removeZeroPadding: !showTrailingZeros })"
      readonly
      label-position="left"
      label-width="140px"
      label-align="right"
      mb-2
    />
  </c-card>
</template>
