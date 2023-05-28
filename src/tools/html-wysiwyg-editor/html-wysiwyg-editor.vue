<script setup lang="ts">
import { format } from 'prettier';
import htmlParser from 'prettier/parser-html';
import { useStorage } from '@vueuse/core';
import Editor from './editor/editor.vue';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const html = useStorage('html-wysiwyg-editor--html', '<h1>Hey!</h1><p>Welcome to this html wysiwyg editor</p>');
</script>

<template>
  <Editor v-model:html="html" />
  <TextareaCopyable :value="format(html, { parser: 'html', plugins: [htmlParser] })" language="html" />
</template>
