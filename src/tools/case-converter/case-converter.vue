<script setup lang="ts">
import {
  camelCase,
  capitalCase,
  constantCase,
  dotCase,
  kebabCase,
  noCase,
  pascalCase,
  pathCase,
  sentenceCase,
  snakeCase,
  split,
  trainCase,
} from 'change-case';
import InputCopyable from '../../components/InputCopyable.vue';

// eslint-disable-next-line regexp/no-obscure-range, regexp/no-dupe-characters-character-class -- The Latin-1 ranges keep accented letters.
const nonLetterRegexp = /[^A-ZØ-öø-ÿ]+/gi;

const baseConfig = {
  // Treat every character other than a letter as a word separator, like the stripRegexp option of change-case 4.
  split: (value: string) => split(value.replace(nonLetterRegexp, ' ')),
};

const input = ref('lorem ipsum dolor sit amet');

const formats = computed(() => [
  {
    label: 'Lowercase:',
    value: input.value.toLocaleLowerCase(),
  },
  {
    label: 'Uppercase:',
    value: input.value.toLocaleUpperCase(),
  },
  {
    label: 'Camelcase:',
    value: camelCase(input.value, baseConfig),
  },
  {
    label: 'Capitalcase:',
    value: capitalCase(input.value, baseConfig),
  },
  {
    label: 'Constantcase:',
    value: constantCase(input.value, baseConfig),
  },
  {
    label: 'Dotcase:',
    value: dotCase(input.value, baseConfig),
  },
  {
    label: 'Headercase:',
    value: trainCase(input.value, baseConfig),
  },
  {
    label: 'Nocase:',
    value: noCase(input.value, baseConfig),
  },
  {
    label: 'Paramcase:',
    value: kebabCase(input.value, baseConfig),
  },
  {
    label: 'Pascalcase:',
    value: pascalCase(input.value, baseConfig),
  },
  {
    label: 'Pathcase:',
    value: pathCase(input.value, baseConfig),
  },
  {
    label: 'Sentencecase:',
    value: sentenceCase(input.value, baseConfig),
  },
  {
    label: 'Snakecase:',
    value: snakeCase(input.value, baseConfig),
  },
  {
    label: 'Mockingcase:',
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
} as const;
</script>

<template>
  <c-card>
    <c-input-text
      v-model:value="input"
      label="Your string:"
      placeholder="Your string..."
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
