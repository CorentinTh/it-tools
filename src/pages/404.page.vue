<script setup lang="ts">
import { Coffee } from '@vicons/tabler';
import { useHead } from '@vueuse/head';

useHead({ title: 'Page not found - IT Tools' });
</script>

<template>
  <div mt-20 flex flex-col items-center>
    <n-icon :component="Coffee" size="100" depth="3" />

    <n-h1 m-0 mt-3>404 Not Found</n-h1>
    <n-text mt-4 block depth="3">Sorry, this page does not seem to exist</n-text>
    <n-text mb-8 block depth="3">Maybe the cache is doing tricky things, try force-refreshing?</n-text>

    <router-link to="/" #="{ navigate, href }" custom>
      <n-button tag="a" :href="href" secondary @click="navigate"> Back home </n-button>
    </router-link>
  </div>
</template>
