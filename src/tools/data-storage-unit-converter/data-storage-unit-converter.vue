<script setup lang="ts">
import InputCopyable from '../../components/InputCopyable.vue';
import { convertBetweenUnits } from './data-storage-unit-converter.service';

const input = ref('1024');
const inputUnit = ref('KB');
const outputUnit = ref('MB');
const precision = ref(3);

const allUnits = ['iB', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB',
  'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB',
  'b', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'];

const output = computed(() => {
  try {
    return convertBetweenUnits({
      value: Number(input.value),
      fromUnit: inputUnit.value,
      toUnit: outputUnit.value,
      precision: precision.value,
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
      <c-input-text
        v-model:value="input"
        label="Input number"
        placeholder="Put your number here (ex: 1024)" label-position="left" label-width="110px" label-align="right"
        mb-2
      />

      <c-select
        searchable
        label="Input unit:"
        :value="inputUnit"
        :options="allUnits"
        placeholder="Select input unit"
        mb-2
      />

      <c-select
        searchable
        label="Output unit:"
        :value="outputUnit"
        :options="allUnits"
        placeholder="Select output unit"
        mb-2
      />

      <n-form-item label="Precision: " label-placement="left" label-width="120" mb-2>
        <n-input-number v-model:value="precision" placeholder="Precision..." :max="10" :min="0" />
      </n-form-item>

      <n-divider />

      <InputCopyable
        label="Output value"
        :value="output"
        placeholder="Output value will be here..."
      />
    </c-card>
  </div>
</template>
