<script setup lang="ts">
import InputCopyable from '../../components/InputCopyable.vue';
import { convertStorage } from './data-storage-unit-converter.model';

const inputProps = {
  'labelPosition': 'left',
  'labelWidth': '170px',
  'labelAlign': 'right',
  'readonly': true,
  'mb-2': '',
} as const;

const input = ref('1024');
const inputUnit = ref('KB');

function errorlessConvert(...args: Parameters<typeof convertStorage>) {
  try {
    return convertStorage(...args);
  }
  catch (err) {
    return '';
  }
}
</script>

<template>
  <div>
    <c-card>
      <c-input-text v-model:value="input" :min="0" label="Input number" placeholder="Put your number here (ex: 1024)" label-position="left" label-width="110px" mb-2 label-align="right" />

      <n-form-item label="Input unit" label-placement="left" label-width="110" :show-feedback="false">
        <n-select
          v-model:value="inputUnit"
          :options="[
            { label: 'Bytes', value: 'B' },
            { label: 'Kilobytes', value: 'KB' },
            { label: 'Megabytes', value: 'MB' },
            { label: 'Gigabytes', value: 'GB' },
            { label: 'Terabytes', value: 'TB' },
            { label: 'Petabytes', value: 'PB' },
          ]"
          placeholder="Select unit"
          w-full
        />
      </n-form-item>

      <n-divider />

      <InputCopyable
        label="Bytes"
        v-bind="inputProps"
        :value="errorlessConvert({ value: Number(input), fromUnit: inputUnit, toUnit: 'B' })"
        placeholder="Bytes will be here..."
      />

      <InputCopyable
        label="KB"
        v-bind="inputProps"
        :value="errorlessConvert({ value: Number(input), fromUnit: inputUnit, toUnit: 'KB' })"
        placeholder="Kilobytes will be here..."
      />

      <InputCopyable
        label="MB"
        v-bind="inputProps"
        :value="errorlessConvert({ value: Number(input), fromUnit: inputUnit, toUnit: 'MB' })"
        placeholder="Megabytes will be here..."
      />

      <InputCopyable
        label="GB"
        v-bind="inputProps"
        :value="errorlessConvert({ value: Number(input), fromUnit: inputUnit, toUnit: 'GB' })"
        placeholder="Gigabytes will be here..."
      />

      <InputCopyable
        label="TB"
        v-bind="inputProps"
        :value="errorlessConvert({ value: Number(input), fromUnit: inputUnit, toUnit: 'TB' })"
        placeholder="Terabytes will be here..."
      />

      <InputCopyable
        label="PB"
        v-bind="inputProps"
        :value="errorlessConvert({ value: Number(input), fromUnit: inputUnit, toUnit: 'PB' })"
        placeholder="Petabytes will be here..."
      />
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.n-input-group:not(:first-child) {
  margin-top: 5px;
}
</style>
