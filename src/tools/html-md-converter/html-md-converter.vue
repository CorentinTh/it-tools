<script setup lang="ts">
import { ref } from 'vue';

import { marked } from 'marked';

import { convertHtmlToMarkdown } from './html-md-converter-service';

import CCard from '@/ui/c-card/c-card.vue';

import CInputText from '@/ui/c-input-text/c-input-text.vue'; // Import the service function

const htmlInput = ref(''); // Reference for HTML input
const markdownOutput = ref(''); // Reference for Markdown output

function convertHtmlToMd() {
  markdownOutput.value = convertHtmlToMarkdown(htmlInput.value); // Using the service function here
}

const previewHtml = computed(() => marked(markdownOutput.value));
</script>

<template>
  <CCard>
    <!-- Input area for HTML -->
    <CInputText v-model:value="htmlInput" multiline placeholder="Paste your HTML here..." rows="5" />

    <!-- Convert button -->
    <button @click="convertHtmlToMd">
      Convert
    </button>

    <!-- Display area for converted Markdown -->
    <CInputText v-model:value="markdownOutput" multiline placeholder="Converted Markdown will appear here..." rows="5" />

    <!-- Preview area for converted Markdown -->
    <div v-html="previewHtml" />
  </CCard>
</template>
