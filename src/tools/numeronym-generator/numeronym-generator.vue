<script setup lang="ts">
import { IconArrowDown } from '@tabler/icons-vue';
import { generateNumeronym } from './numeronym-generator.service';

const word = ref('');

const numeronym = computed(() => generateNumeronym(word.value));
</script>

<template>
  <div flex flex-col items-center gap-4>
    <c-input-text v-model:value="word" placeholder="Enter a word, e.g. 'internationalization'" size="large" clearable test-id="word-input" />

    <IconArrowDown size="35" />

    <input-copyable :value="numeronym" size="large" readonly placeholder="Your numeronym will be here, e.g. 'i18n'" test-id="numeronym" />
  </div>
</template>
