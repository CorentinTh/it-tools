<script setup lang="ts">
import { ref } from 'vue';
import { convertHtmlToMarkdown } from './html-md-converter-service'; // Import the service function

const htmlInput = ref(''); // Reference for HTML input
const markdownOutput = ref(''); // Reference for Markdown output

const convertHtmlToMd = () => {
  markdownOutput.value = convertHtmlToMarkdown(htmlInput.value); // Using the service function here
};
</script>

<template>
  <c-card>
    <!-- Input area for HTML -->
    <c-input-text v-model:value="htmlInput" multiline placeholder="Paste your HTML here..." rows="5" />

    <!-- Convert button -->
    <button @click="convertHtmlToMd">Convert</button>

    <!-- Display area for converted Markdown -->
    <c-input-text v-model:value="markdownOutput" multiline placeholder="Converted Markdown will appear here..." rows="5" />

    <!-- Optionally, you can add more features like 'Clear', 'Copy to Clipboard', etc. -->
  </c-card>
</template>

