<script lang="ts" setup>
import _ from 'lodash';
import { demoRoutes } from './demo.routes';

const route = useRoute();

const componentName = computed(() => _.startCase(String(route.name).replace(/^c-/, '')));
</script>

<template>
  <div mt-2 w-full p-8>
    <h1>c-lib components</h1>

    <div flex>
      <div w-200px b-r b-gray b-op-10 b-r-solid pr-4>
        <c-button
          v-for="{ name } of demoRoutes"
          :key="name"
          variant="text"
          :to="{ name }"
          w-full
          important:justify-start
          important:text-left
          :type="route.name === name ? 'primary' : 'default'"
        >
          {{ name }}
        </c-button>
      </div>

      <div flex-1 pl-4>
        <h1>{{ componentName }}</h1>

        <router-view />
      </div>
    </div>
  </div>
</template>
