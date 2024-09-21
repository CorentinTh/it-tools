<script setup lang="ts">
import InputCopyable from '../../components/InputCopyable.vue';
import { type AllSupportedUnits, convertStorageAndRateUnitsDisplay } from './data-storage-unit-converter.service';

const input = ref<{ size: string; unit: string }>({ size: '0', unit: 'KB' });
const output = ref<{ unit: string; precision: number; appendUnit: boolean }>({ unit: 'MB', precision: 3, appendUnit: false });

const allUnits = [
  { value: 'B', label: 'Bytes (B)' },
  { value: 'b', label: 'Bits (bit)' },
  { value: 'iB', label: 'Bibytes (iB)' },
  { value: 'KB', label: 'Kilobytes (KB)' },
  { value: 'Kb', label: 'Kilobits (Kbit)' },
  { value: 'KiB', label: 'Kibibytes (KiB)' },
  { value: 'MB', label: 'Megabytes (MB)' },
  { value: 'Mb', label: 'Megabits (Mbit)' },
  { value: 'MiB', label: 'Mebibytes (MiB)' },
  { value: 'GB', label: 'Gigabytes (GB)' },
  { value: 'Gb', label: 'Gigabits (Gbit)' },
  { value: 'GiB', label: 'Gibibytes (GiB)' },
  { value: 'TB', label: 'Terabytes (TB)' },
  { value: 'Tb', label: 'Terabits (Tbit)' },
  { value: 'TiB', label: 'Tebibytes (TiB)' },
  { value: 'PB', label: 'Petabytes (PB)' },
  { value: 'Pb', label: 'Petabits (Pbit)' },
  { value: 'PiB', label: 'Pebibytes (PiB)' },
  { value: 'EB', label: 'Exabytes (EB)' },
  { value: 'Eb', label: 'Exabits (Ebit)' },
  { value: 'EiB', label: 'Exbibytes (EiB)' },
  { value: 'ZB', label: 'Zettabytes (ZB)' },
  { value: 'Zb', label: 'Zettabits (Zbit)' },
  { value: 'ZiB', label: 'Zebibytes (ZiB)' },
  { value: 'YB', label: 'Yottabytes (YB)' },
  { value: 'Yb', label: 'Yottabits (Ybit)' },
  { value: 'YiB', label: 'Yobibytes (YiB)' },
];

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
          <n-input-number v-model:value="output.precision" style="width:100px" placeholder="Precision..." :max="10" :min="0" />
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
