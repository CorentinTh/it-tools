---
to: src/ui/<%= h.changeCase.param(name) %>/<%= h.changeCase.param(name) %>.vue
---
<script lang="ts" setup>
const props = withDefaults(defineProps<{ prop?: string }>(), { prop: '' });
const { prop } = toRefs(props);
</script>

<template>
  <div>
    {{ prop }}
  </div>
</template>
