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
    title: 'Bold',
    action: () => editor.value.chain().focus().toggleBold().run(),
    isActive: () => editor.value.isActive('bold'),
  },
  {
    type: 'button',
    icon: Italic,
    title: 'Italic',
    action: () => editor.value.chain().focus().toggleItalic().run(),
    isActive: () => editor.value.isActive('italic'),
  },
  {
    type: 'button',
    icon: Strikethrough,
    title: 'Strike',
    action: () => editor.value.chain().focus().toggleStrike().run(),
    isActive: () => editor.value.isActive('strike'),
  },
  {
    type: 'button',
    icon: Code,
    title: 'Inline code',
    action: () => editor.value.chain().focus().toggleCode().run(),
    isActive: () => editor.value.isActive('code'),
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    icon: H1,
    title: 'Heading 1',
    action: () => editor.value.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: () => editor.value.isActive('heading', { level: 1 }),
  },
  {
    type: 'button',
    icon: H2,
    title: 'Heading 2',
    action: () => editor.value.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: () => editor.value.isActive('heading', { level: 2 }),
  },
  {
    type: 'button',
    icon: H3,
    title: 'Heading 3',
    action: () => editor.value.chain().focus().toggleHeading({ level: 4 }).run(),
    isActive: () => editor.value.isActive('heading', { level: 4 }),
  },
  {
    type: 'button',
    icon: H4,
    title: 'Heading 4',
    action: () => editor.value.chain().focus().toggleHeading({ level: 4 }).run(),
    isActive: () => editor.value.isActive('heading', { level: 4 }),
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    icon: List,
    title: 'Bullet list',
    action: () => editor.value.chain().focus().toggleBulletList().run(),
    isActive: () => editor.value.isActive('bulletList'),
  },
  {
    type: 'button',
    icon: ListNumbers,
    title: 'Ordered list',
    action: () => editor.value.chain().focus().toggleOrderedList().run(),
    isActive: () => editor.value.isActive('orderedList'),
  },
  {
    type: 'button',
    icon: CodePlus,
    title: 'Code block',
    action: () => editor.value.chain().focus().toggleCodeBlock().run(),
    isActive: () => editor.value.isActive('codeBlock'),
  },

  {
    type: 'button',
    icon: Blockquote,
    title: 'Blockquote',
    action: () => editor.value.chain().focus().toggleBlockquote().run(),
    isActive: () => editor.value.isActive('blockquote'),
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    icon: TextWrap,
    title: 'Hard break',
    action: () => editor.value.chain().focus().setHardBreak().run(),
  },
  {
    type: 'button',
    icon: ClearFormatting,
    title: 'Clear format',
    action: () => editor.value.chain().focus().clearNodes().unsetAllMarks().run(),
  },

  {
    type: 'button',
    icon: ArrowBack,
    title: 'Undo',
    action: () => editor.value.chain().focus().undo().run(),
  },
  {
    type: 'button',
    icon: ArrowForwardUp,
    title: 'Redo',
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
