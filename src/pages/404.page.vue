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
      {{ $t('404.notFound') }}
    </h1>
    <div mt-4 op-60>
      {{ $t('404.sorry') }}
    </div>
    <div mb-8 op-60>
      {{ $t('404.maybe') }}
    </div>

    <c-button to="/">
      {{ $t('404.backHome') }}
    </c-button>
  </div>
</template>
