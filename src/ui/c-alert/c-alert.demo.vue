<script lang="ts" setup>
const variants = ['warning', 'error'] as const;
</script>

<template>
  <h2>Basic</h2>
  <c-alert v-for="variant in variants" :key="variant" :type="variant" mb-4>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni reprehenderit itaque enim? Suscipit magni optio velit
    quia, eveniet repellat pariatur quaerat laudantium dignissimos natus, beatae deleniti adipisci, atque necessitatibus
    odio!
  </c-alert>

  <h2>With title</h2>
  <c-alert v-for="variant in variants" :key="variant" :type="variant" title="This is the title" mb-4>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni reprehenderit itaque enim? Suscipit magni optio velit
    quia, eveniet repellat pariatur quaerat laudantium dignissimos natus, beatae deleniti adipisci, atque necessitatibus
    odio!
  </c-alert>
</template>
