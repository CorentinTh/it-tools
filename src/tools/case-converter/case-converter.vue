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

const { t } = useI18n();

const input = ref('lorem ipsum dolor sit amet');

const formats = computed(() => [
  {
    label: t('tools.case-converter.lowercase'),
    value: input.value.toLocaleLowerCase(),
  },
  {
    label: t('tools.case-converter.uppercase'),
    value: input.value.toLocaleUpperCase(),
  },
  {
    label: t('tools.case-converter.camelcase'),
    value: camelCase(input.value, baseConfig),
  },
  {
    label: t('tools.case-converter.capitalcase'),
    value: capitalCase(input.value, baseConfig),
  },
  {
    label: t('tools.case-converter.constantcase'),
    value: constantCase(input.value, baseConfig),
  },
  {
    label: t('tools.case-converter.dotcase'),
    value: dotCase(input.value, baseConfig),
  },
  {
    label: t('tools.case-converter.headercase'),
    value: headerCase(input.value, baseConfig),
  },
  {
    label: t('tools.case-converter.nocase'),
    value: noCase(input.value, baseConfig),
  },
  {
    label: t('tools.case-converter.paramcase'),
    value: paramCase(input.value, baseConfig),
  },
  {
    label: t('tools.case-converter.pascalcase'),
    value: pascalCase(input.value, baseConfig),
  },
  {
    label: t('tools.case-converter.pathcase'),
    value: pathCase(input.value, baseConfig),
  },
  {
    label: t('tools.case-converter.sentencecase'),
    value: sentenceCase(input.value, baseConfig),
  },
  {
    label: t('tools.case-converter.snakecase'),
    value: snakeCase(input.value, baseConfig),
  },
  {
    label: t('tools.case-converter.mockingcase'),
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
      :label="t('tools.case-converter.inputLabel')"
      :placeholder="t('tools.case-converter.inputPlaceholder')"
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
