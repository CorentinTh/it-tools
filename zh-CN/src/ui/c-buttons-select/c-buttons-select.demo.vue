<script setup lang="ts">
const optionsA = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b', tooltip: 'This is a tooltip' },
  { label: 'Option C', value: 'c' },
];

const optionB = {
  'Option A': 'a',
  'Option B': 'b',
  'Option C': 'c',
};

const valueA = ref('a');
</script>

<template>
  <c-buttons-select v-model:value="valueA" :options="optionsA" label="Label: " />
  <c-buttons-select v-model:value="valueA" :options="optionsA" label="Label: " label-position="left" mt-2 />
  <c-buttons-select v-model:value="valueA" :options="optionB" label="Options object: " />
</template>
