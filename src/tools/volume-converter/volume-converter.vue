<script setup lang="ts">
import { computed, ref } from 'vue';
import convert from 'convert-units';
import InputCopyable from '../../components/InputCopyable.vue';

const inputValue = ref(1);
const fromUnit = ref('l');
const toUnit = ref('gal');

const units = convert().possibilities('volume');

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
    <n-input-group>
      <n-input-group-label style="width: 120px; text-align: right">
        Value:
      </n-input-group-label>
      <n-input-number v-model:value="inputValue" style="flex: 1" />
    </n-input-group>

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
