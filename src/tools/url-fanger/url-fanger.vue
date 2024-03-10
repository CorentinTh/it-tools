<script setup lang="ts">
import { defang, refang } from 'fanger';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const textInput = ref('');
const defangOutput = computed(() => defang(textInput.value));

const fangedInput = ref('');
const refangOutput = computed(() => refang(fangedInput.value));
</script>

<template>
  <c-card title="Refang string">
    <c-input-text
      v-model:value="fangedInput"
      multiline
      placeholder="Put your string here..."
      rows="5"
      label="String to refang"
      raw-text
      mb-5
    />

    <TextareaCopyable
      label="String fanged"
      :value="refangOutput"
      placeholder="The refang encoding of your string will be here"
      mb-5
    />
  </c-card>

  <c-card title="Defang string">
    <c-input-text
      v-model:value="textInput"
      multiline
      placeholder="Your fanged string..."
      rows="5"
      label="Fanged string to decode"
      mb-5
    />

    <TextareaCopyable
      v-model:value="defangOutput"
      label="Defanged string"
      placeholder="The defanged string will be here"
      mb-5
    />
  </c-card>
</template>
