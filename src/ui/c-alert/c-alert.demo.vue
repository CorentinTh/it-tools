<script lang="ts" setup>
const variants = ['warning'] as const;
</script>

<template>
  <c-alert v-for="variant in variants" :key="variant" :type="variant" mb-4>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni reprehenderit itaque enim? Suscipit magni optio velit
    quia, eveniet repellat pariatur quaerat laudantium dignissimos natus, beatae deleniti adipisci, atque necessitatibus
    odio!
  </c-alert>
</template>
