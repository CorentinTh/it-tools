<script setup lang="ts">
import {
  camelCase,
  capitalCase,
  constantCase,
  dotCase,
  headerCase,
  noCase,
  paramCase,
  pascalCase,
  pathCase,
  sentenceCase,
  snakeCase,
} from 'change-case';
import InputCopyable from '../../components/InputCopyable.vue';

const baseConfig = {
  stripRegexp: /[^A-Za-zÀ-ÖØ-öø-ÿ]+/gi,
};

const input = ref('The quick brown fox jumps over the lazy dog.');

const formats = computed(() => [
  {
    label: '小写式:',
    value: input.value.toLocaleLowerCase(),
  },
  {
    label: '大写式:',
    value: input.value.toLocaleUpperCase(),
  },
  {
    label: '驼峰式:',
    value: camelCase(input.value, baseConfig),
  },
  {
    label: '首大式:',
    value: capitalCase(input.value, baseConfig),
  },
  {
    label: '常量式:',
    value: constantCase(input.value, baseConfig),
  },
  {
    label: '点符式:',
    value: dotCase(input.value, baseConfig),
  },
  {
    label: '标头式:',
    value: headerCase(input.value, baseConfig),
  },
  {
    label: '默认式:',
    value: noCase(input.value, baseConfig),
  },
  {
    label: '参数式:',
    value: paramCase(input.value, baseConfig),
  },
  {
    label: '帕斯卡式:',
    value: pascalCase(input.value, baseConfig),
  },
  {
    label: '路径式:',
    value: pathCase(input.value, baseConfig),
  },
  {
    label: '语句式:',
    value: sentenceCase(input.value, baseConfig),
  },
  {
    label: '蛇形式:',
    value: snakeCase(input.value, baseConfig),
  },
  {
    label: '模拟式:',
    value: input.value
      .split('')
      .map((char, index) => (index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()))
      .join(''),
  },
]);

const inputLabelAlignmentConfig = {
  labelPosition: 'left',
  labelWidth: '120px',
  labelAlign: 'right',
};
</script>

<template>
  <c-card>
    <c-input-text
      v-model:value="input"
      label="原始短句："
      placeholder="原始短句..."
      raw-text
      v-bind="inputLabelAlignmentConfig"
    />

    <div my-16px divider />

    <InputCopyable
      v-for="format in formats"
      :key="format.label"
      :value="format.value"
      :label="format.label"
      v-bind="inputLabelAlignmentConfig"
      mb-1
    />
  </c-card>
</template>
