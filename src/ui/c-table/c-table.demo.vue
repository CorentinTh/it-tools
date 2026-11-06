<script lang="ts" setup>
const data = ref([
  { name: 'John', age: 20 },
  { name: 'Jane', age: 24 },
  { name: 'Joe', age: 30 },
]);
</script>

<template>
  <c-table :data="data" mb-2 />
  <c-table :data="data" hide-headers mb-2 />
  <c-table :data="data" :headers="['age', 'name']" mb-2 />
  <c-table :data="data" :headers="['age', { key: 'name', label: 'Full name' }]" mb-2 />
  <c-table :data="data" :headers="{ name: 'full name' }" mb-2 />
  <c-table :data="data" :headers="['age', 'name']">
    <template #age="{ value }">
      {{ value }}yo
    </template>
  </c-table>
</template>
