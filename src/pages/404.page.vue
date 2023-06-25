<script setup lang="ts">
import { useHead } from '@vueuse/head';

useHead({ title: 'Page not found - IT Tools' });
</script>

<template>
  <div mt-20 flex flex-col items-center>
    <span text-90px lh-1 op-50>
      <icon-mdi:kettle-steam-outline />
    </span>

    <h1 m-0 mt-3>
      404 Not Found
    </h1>
    <div mt-4 op-60>
      Sorry, this page does not seem to exist
    </div>
    <div mb-8 op-60>
      Maybe the cache is doing tricky things, try force-refreshing?
    </div>

    <c-button to="/">
      Back home
    </c-button>
  </div>
</template>
