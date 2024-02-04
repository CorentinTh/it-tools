<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3';
import {
  ArrowBack,
  ArrowForwardUp,
  Blockquote,
  Bold,
  ClearFormatting,
  Code,
  CodePlus,
  H1,
  H2,
  H3,
  H4,
  Italic,
  List,
  ListNumbers,
  Strikethrough,
  TextWrap,
} from '@vicons/tabler';
import type { Component } from 'vue';
import MenuBarItem from './menu-bar-item.vue';

const props = defineProps<{ editor: Editor }>();
const { editor } = toRefs(props);

type MenuItem =
  | {
    icon: Component
    title: string
    action: () => void
    isActive?: () => boolean
    type: 'button'
  }
  | { type: 'divider' };

const items: MenuItem[] = [
  {
    type: 'button',
    icon: Bold,
    title: '粗体',
    action: () => editor.value.chain().focus().toggleBold().run(),
    isActive: () => editor.value.isActive('bold'),
  },
  {
    type: 'button',
    icon: Italic,
    title: '斜体',
    action: () => editor.value.chain().focus().toggleItalic().run(),
    isActive: () => editor.value.isActive('italic'),
  },
  {
    type: 'button',
    icon: Strikethrough,
    title: '删除线',
    action: () => editor.value.chain().focus().toggleStrike().run(),
    isActive: () => editor.value.isActive('strike'),
  },
  {
    type: 'button',
    icon: Code,
    title: '内联代码',
    action: () => editor.value.chain().focus().toggleCode().run(),
    isActive: () => editor.value.isActive('code'),
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    icon: H1,
    title: '一级标题',
    action: () => editor.value.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: () => editor.value.isActive('heading', { level: 1 }),
  },
  {
    type: 'button',
    icon: H2,
    title: '二级标题',
    action: () => editor.value.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: () => editor.value.isActive('heading', { level: 2 }),
  },
  {
    type: 'button',
    icon: H3,
    title: '三级标题',
    action: () => editor.value.chain().focus().toggleHeading({ level: 4 }).run(),
    isActive: () => editor.value.isActive('heading', { level: 4 }),
  },
  {
    type: 'button',
    icon: H4,
    title: '四级标题',
    action: () => editor.value.chain().focus().toggleHeading({ level: 4 }).run(),
    isActive: () => editor.value.isActive('heading', { level: 4 }),
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    icon: List,
    title: '符号列表',
    action: () => editor.value.chain().focus().toggleBulletList().run(),
    isActive: () => editor.value.isActive('bulletList'),
  },
  {
    type: 'button',
    icon: ListNumbers,
    title: '有序列表',
    action: () => editor.value.chain().focus().toggleOrderedList().run(),
    isActive: () => editor.value.isActive('orderedList'),
  },
  {
    type: 'button',
    icon: CodePlus,
    title: '代码块',
    action: () => editor.value.chain().focus().toggleCodeBlock().run(),
    isActive: () => editor.value.isActive('codeBlock'),
  },

  {
    type: 'button',
    icon: Blockquote,
    title: '引用',
    action: () => editor.value.chain().focus().toggleBlockquote().run(),
    isActive: () => editor.value.isActive('blockquote'),
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    icon: TextWrap,
    title: '强制换行',
    action: () => editor.value.chain().focus().setHardBreak().run(),
  },
  {
    type: 'button',
    icon: ClearFormatting,
    title: '清除格式',
    action: () => editor.value.chain().focus().clearNodes().unsetAllMarks().run(),
  },

  {
    type: 'button',
    icon: ArrowBack,
    title: '撤销',
    action: () => editor.value.chain().focus().undo().run(),
  },
  {
    type: 'button',
    icon: ArrowForwardUp,
    title: '重做',
    action: () => editor.value.chain().focus().redo().run(),
  },
];
</script>

<template>
  <div flex items-center>
    <template v-for="(item, index) in items">
      <n-divider v-if="item.type === 'divider'" :key="`divider${index}`" vertical />
      <MenuBarItem v-else-if="item.type === 'button'" :key="index" v-bind="item" />
    </template>
  </div>
</template>
