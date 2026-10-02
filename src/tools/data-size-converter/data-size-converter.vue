<script setup lang="ts">
import InputCopyable from '../../components/InputCopyable.vue';
import { type DataSizeBase, type DataSizeUnit, convertDataSize, dataSizeUnits } from './data-size-converter.models';

const storage = useStorage('data-size-converter:config', {
  value: 1,
  from: 'GB' as DataSizeUnit,
  base: 1000 as DataSizeBase,
});

const unitOptions = dataSizeUnits.map(unit => ({ label: unit, value: unit }));
const baseOptions = [
  { label: 'Decimal (1 kB = 1000 B)', value: 1000 },
  { label: 'Binary (1 KB = 1024 B)', value: 1024 },
];

const converted = computed(() =>
  dataSizeUnits.map((unit) => {
    const value = convertDataSize({
      value: Number.isFinite(storage.value.value) ? storage.value.value : 0,
      from: storage.value.from,
      to: unit,
      base: storage.value.base,
    });
    return { unit, value: Number.isInteger(value) ? String(value) : String(Number(value.toFixed(12))) };
  }),
);

const labelAlignmentConfig = {
  labelPosition: 'left',
  labelWidth: '120px',
  labelAlign: 'right',
};
</script>

<template>
  <c-card style="max-width: 640px">
    <n-grid cols="2" x-gap="12" w-full>
      <n-gi>
        <c-input-text
          v-model:value="storage.value"
          label="Value:"
          label-position="left"
          label-width="120px"
          label-align="right"
          placeholder="Amount to convert"
          mb-2
        />
      </n-gi>
      <n-gi>
        <c-select
          v-model:value="storage.from"
          label="Input unit:"
          label-position="left"
          label-width="120px"
          label-align="right"
          :options="unitOptions"
          mb-2
        />
      </n-gi>
    </n-grid>

    <n-form-item label="Base" label-placement="left" label-width="120" :show-feedback="false" mb-2>
      <n-radio-group v-model:value="storage.base">
        <n-radio-button v-for="option in baseOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </n-radio-button>
      </n-radio-group>
    </n-form-item>

    <div divider />

    <div v-if="!Number.isFinite(storage.value) || String(storage.value).trim() === ''" text-center>
      Enter a number to convert.
    </div>
    <template v-else>
      <InputCopyable
        v-for="row in converted"
        :key="row.unit"
        :value="row.value"
        :label="`${row.unit}:`"
        v-bind="labelAlignmentConfig"
        mb-1
      />
    </template>
  </c-card>
</template>
