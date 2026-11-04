<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { format } from 'prettier';
import htmlParser from 'prettier/plugins/html';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import Editor from './editor/editor.vue';

const html = useStorage('html-wysiwyg-editor--html', '<h1>Hey!</h1><p>Welcome to this html wysiwyg editor</p>');

const formattedHtml = asyncComputed(() => format(html.value, { parser: 'html', plugins: [htmlParser] }), '');
</script>

<template>
  <Editor v-model:html="html" />
  <TextareaCopyable :value="formattedHtml" language="html" />
</template>
