<script lang="ts" setup>
import { demoRoutes } from './demo.routes';
</script>

<template>
  <div grid grid-cols-5 gap-2>
    <c-button v-for="{ name } of demoRoutes" :key="name" :to="{ name }">
      {{ name }}
    </c-button>
  </div>
</template>
