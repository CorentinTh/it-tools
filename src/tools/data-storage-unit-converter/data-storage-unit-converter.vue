<script setup lang="ts">
import InputCopyable from '../../components/InputCopyable.vue';
import { type AllSupportedUnits, convertStorageAndRateUnitsDisplay } from './data-storage-unit-converter.service';

const input = ref<{ size: string; unit: string }>({ size: '0', unit: 'KB' });
const output = ref<{ unit: string; precision: number; appendUnit: boolean }>({ unit: 'MB', precision: 3, appendUnit: false });

const allUnits = [
  'iB', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB',
  'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB',
  'b', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'];

const convertedValue = computed(() => {
  try {
    return convertStorageAndRateUnitsDisplay({
      value: Number(input.value.size),
      fromUnit: input.value.unit as AllSupportedUnits,
      toUnit: output.value.unit as AllSupportedUnits,
      precision: output.value.precision,
      appendUnit: output.value.appendUnit,
    });
  }
  catch (e: any) {
    return e.toString();
  }
});
</script>

<template>
  <div>
    <c-card>
      <n-form-item label="Input Size:" label-placement="left" mb-1>
        <c-input-text
          v-model:value="input.size"
          placeholder="Put your number here (ex: 1024)"
          mr-2
        />
        <c-select
          v-model:value="input.unit"
          :options="allUnits"
          placeholder="Select input unit"
        />
      </n-form-item>

      <div flex items-baseline gap-2>
        <c-select
          v-model:value="output.unit"
          label="Output:" label-position="left"
          :options="allUnits"
          placeholder="Select output unit"
        />

        <n-form-item label="Precision:" label-placement="left">
          <n-input-number v-model:value="output.precision" placeholder="Precision..." :max="10" :min="0" />
        </n-form-item>

        <n-checkbox v-model:checked="output.appendUnit">
          Show unit?
        </n-checkbox>
      </div>

      <n-divider />

      <InputCopyable
        label="Output value"
        :value="convertedValue"
        placeholder="Output value will be here..."
      />
    </c-card>
  </div>
</template>
