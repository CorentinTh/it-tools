<script setup lang="ts">
import { SelectItemText, type SelectItemTextProps } from 'radix-vue'

const props = defineProps<SelectItemTextProps>()
</script>

<template>
  <SelectItemText v-bind="props">
    <slot />
  </SelectItemText>
</template>
