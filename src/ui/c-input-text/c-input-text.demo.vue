<template>
  <h2>Default</h2>

  <c-input-text value="qsd" />

  <h2>With placeholder</h2>

  <c-input-text placeholder="Placeholder" />

  <h2>With label</h2>

  <c-input-text label="Label" mb-2 />
  <c-input-text label="Label" mb-2 label-position="left" />
  <c-input-text label="Label" mb-2 label-position="left" label-width="100px" />
  <c-input-text label="Label" mb-2 label-position="left" label-width="100px" label-align="right" />

  <h2>Readonly</h2>

  <c-input-text value="value" readonly />

  <h2>Disabled</h2>

  <c-input-text value="value" disabled />

  <h2>Validation</h2>

  <c-input-text
    v-model:value="value"
    :validation-rules="[{ message: 'Length must be > 10', validator: (value) => value.length > 10 }]"
  />

  <h2>Clearable</h2>

  <c-input-text v-model:value="value" clearable />
</template>

<script lang="ts" setup>
const value = ref('value');
</script>
