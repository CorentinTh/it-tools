<script setup lang="ts">
import { generateNumeronym } from './numeronym-generator.service';

const word = ref('');

const numeronym = computed(() => generateNumeronym(word.value));
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-card title="Input">
      <c-input-text v-model:value="word" label="Word" placeholder="Enter a word, e.g. 'internationalization'" size="large" clearable test-id="word-input" />
    </c-card>
    <c-card title="Result">
      <input-copyable :value="numeronym" label="Numeronym" size="large" readonly monospace placeholder="Your numeronym will be here, e.g. 'i18n'" test-id="numeronym" />
    </c-card>
  </div>
</template>
