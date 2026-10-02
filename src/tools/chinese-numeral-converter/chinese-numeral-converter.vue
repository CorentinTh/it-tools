<script setup lang="ts">
import { type ChineseNumeralStyle, convertToChineseNumeral } from './chinese-numeral-converter.models';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const input = ref('1234567.89');
const style = ref<ChineseNumeralStyle>('uppercase');
const currency = ref(true);

const output = computed(() => convertToChineseNumeral(input.value, { style: style.value, currency: currency.value }));
</script>

<template>
  <c-card style="max-width: 640px">
    <c-input-text
      v-model:value="input"
      label="Your number:"
      placeholder="e.g. 1234567.89"
      raw-text
    />

    <n-divider />

    <n-form-item label="Style" label-placement="left" label-width="120" :show-feedback="false" mb-2>
      <n-radio-group v-model:value="style">
        <n-radio-button value="uppercase">
          大写 (壹贰叁)
        </n-radio-button>
        <n-radio-button value="lowercase">
          小写 (一二三)
        </n-radio-button>
      </n-radio-group>
    </n-form-item>

    <n-form-item label="Mode" label-placement="left" label-width="120" :show-feedback="false" mb-2>
      <n-checkbox v-model:checked="currency">
        Read as RMB amount (元/角/分)
      </n-checkbox>
    </n-form-item>

    <n-divider />

    <c-alert v-if="output.error" type="error" text-center>
      {{ output.error }}
    </c-alert>

    <n-form-item v-else-if="output.result" label="Chinese numerals:" label-placement="top">
      <TextareaCopyable :value="output.result" copy-placement="outside" />
    </n-form-item>
  </c-card>
</template>
