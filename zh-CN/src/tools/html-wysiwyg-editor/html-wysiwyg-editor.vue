<script setup lang="ts">
import { format } from 'prettier';
import htmlParser from 'prettier/plugins/html';
import { useStorage } from '@vueuse/core';
import Editor from './editor/editor.vue';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const html = useStorage('html-wysiwyg-editor--html', '<h1>嘿！</h1><p>欢迎使用这个 HTML 在线编辑器</p>');

const formattedHtml = asyncComputed(() => format(html.value, { parser: 'html', plugins: [htmlParser] }), '');
</script>

<template>
  <Editor v-model:html="html" />
  <TextareaCopyable :value="formattedHtml" language="html" />
</template>
