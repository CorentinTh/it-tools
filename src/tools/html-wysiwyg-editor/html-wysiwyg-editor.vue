<template>
  <editor v-model:html="html" />
  <textarea-copyable :value="format(html, { parser: 'html', plugins: [htmlParser] })" language="html" />
</template>

<script setup lang="ts">
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { format } from 'prettier';
import htmlParser from 'prettier/parser-html';
import { useStorage } from '@vueuse/core';
import Editor from './editor/editor.vue';

const html = useStorage('html-wysiwyg-editor--html', '<h1>Hey!</h1><p>Welcome to this html wysiwyg editor</p>');
</script>

<style lang="less" scoped></style>
