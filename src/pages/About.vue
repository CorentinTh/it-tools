<script setup lang="ts">
import { useHead } from '@vueuse/head';

useHead({ title: 'About - WowToolbar' });

const aboutContent = `# About WowToolbar

WowToolbar is a privacy-friendly collection of fast, focused online utilities for development, data conversion, text processing, networking, and everyday tasks.

## Private by default

Tools run in your browser whenever possible. Content entered into a tool is not intentionally stored by WowToolbar.

## Simple and reliable

The interface is designed to stay quick, distraction-free, and useful across desktop and mobile devices.`;
</script>

<template>
  <c-markdown :markdown="aboutContent" mx-auto mt-50px max-w-600px />
</template>
