<script setup lang="ts">
import { computed, ref } from 'vue';
import convert from 'convert-units';
import InputCopyable from '../../components/InputCopyable.vue';

const inputValue = ref(1);
const fromUnit = ref('kg');
const toUnit = ref('lb');

const units = convert().possibilities('mass');

const fromOptions = computed(() => {
  return units.map(unit => ({ label: unit, value: unit }));
});

const toOptions = computed(() => {
  return units.map(unit => ({ label: unit, value: unit }));
});

const result = computed(() => {
  try {
    return convert(inputValue.value).from(fromUnit.value as any).to(toUnit.value as any);
  }
  catch (e) {
    return 'N/A';
  }
});

const inputLabelAlignmentConfig = {
  labelPosition: 'left',
  labelWidth: '120px',
  labelAlign: 'right',
};
</script>

<template>
  <c-card>
    <c-input-number
      v-model:value="inputValue"
      label="Value:"
      v-bind="inputLabelAlignmentConfig"
    />
    <c-select
      v-model:value="fromUnit"
      :options="fromOptions"
      label="From:"
      v-bind="inputLabelAlignmentConfig"
      class="mt-4"
    />
    <c-select
      v-model:value="toUnit"
      :options="toOptions"
      label="To:"
      v-bind="inputLabelAlignmentConfig"
      class="mt-4"
    />

    <div my-16px divider />

    <InputCopyable
      :value="result.toString()"
      label="Result:"
      v-bind="inputLabelAlignmentConfig"
      mb-1
    />
  </c-card>
</template>
