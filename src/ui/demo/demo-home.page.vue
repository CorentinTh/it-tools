<script lang="ts" setup>
import { demoRoutes } from './demo.routes';
</script>

<template>
  <div grid grid-cols-5 gap-2>
    <c-card v-for="{ name } of demoRoutes" :key="name" :title="String(name)">
      <c-button :to="{ name }">
        {{ name }}
      </c-button>
    </c-card>
  </div>
</template>
