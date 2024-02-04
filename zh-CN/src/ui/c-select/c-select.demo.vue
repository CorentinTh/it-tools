<script lang="ts" setup>
const optionsA = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
];

const optionsBig = Array.from({ length: 1000 }, (_, i) => ({ label: `Option ${i}`, value: i }));

const sizes = ['small', 'medium', 'large'] as const;
const value = ref('');
</script>

<template>
  <h2>Sizes</h2>
  <c-select v-for="size in sizes" :key="size" v-model:value="value" :options="optionsA" :size="size" mb-2 />

  <h2>Searchable</h2>
  <c-select v-for="size in sizes" :key="size" v-model:value="value" :options="optionsA" :size="size" searchable mb-2 />

  <h2>Big list</h2>
  <c-select v-model:value="value" :options="optionsBig" searchable />

  <h2>Empty</h2>
  <c-select :options="[]" />

  <h2>String array as options</h2>
  <c-select v-model:value="value" :options="['a', 'Option B', 'Option C']" />

  <h2>Labels</h2>
  <c-select label="Label" mb-2 />
  <c-select label="Label" label-position="left" mb-2 />
  <c-select label="Label" label-position="left" label-align="left" mb-2 label-width="200px" />
  <c-select label="Label" label-position="left" label-align="center" mb-2 label-width="200px" />
  <c-select label="Label" label-position="left" label-align="right" mb-2 label-width="200px" />

  <h2>Custom displayed value</h2>
  <c-select v-model:value="value" :options="optionsA" mb-2>
    <template #displayed-value>
      <span class="font-bold lh-normal">Hello</span>
    </template>
  </c-select>

  <c-select v-model:value="value" :options="optionsA">
    <template #displayed-value>
      <span lh-normal>
        <icon-mdi-translate />
      </span>
    </template>
  </c-select>
</template>
