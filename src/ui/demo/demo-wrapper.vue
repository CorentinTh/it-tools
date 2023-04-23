<template>
  <div mt-2 w-full p-8>
    <h1>c-lib components</h1>

    <div flex>
      <div w-30 b-r b-gray b-op-10 b-r-solid pr-4>
        <c-button
          v-for="{ name } of demoRoutes"
          :key="name"
          variant="text"
          :to="{ name }"
          w-full
          important:justify-start
          :type="route.name === name ? 'primary' : 'default'"
        >
          {{ name }}
        </c-button>
      </div>

      <div flex-1 pl-4>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { demoRoutes } from './demo.routes';

const route = useRoute();
</script>

<style lang="less" scoped></style>
