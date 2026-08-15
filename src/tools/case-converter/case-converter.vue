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
    value: headerCase(input.value, baseConfig),
  },
  {
    label: 'Nocase:',
    value: noCase(input.value, baseConfig),
  },
  {
    label: 'Paramcase:',
    value: paramCase(input.value, baseConfig),
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
</script>

<template>
  <div class="c-form-layout">
    <c-card title="Input">
      <c-input-text
        v-model:value="input"
        label="String to convert"
        placeholder="Your string..."
        raw-text
      />
    </c-card>

    <c-card title="Converted values">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <InputCopyable
          v-for="format in formats"
          :key="format.label"
          :value="format.value"
          :label="format.label.replace(/:$/, '')"
          readonly
          monospace
        />
      </div>
    </c-card>
  </div>
</template>
