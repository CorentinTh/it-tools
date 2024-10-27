<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3';
import {
  IconArrowBack,
  IconArrowForwardUp,
  IconBlockquote,
  IconBold,
  IconClearFormatting,
  IconCode,
  IconCodePlus,
  IconH1,
  IconH2,
  IconH3,
  IconH4,
  IconItalic,
  IconList,
  IconListNumbers,
  IconStrikethrough,
  IconTextWrap,
} from '@tabler/icons-vue';
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
    icon: IconBold,
    title: 'Bold',
    action: () => editor.value.chain().focus().toggleBold().run(),
    isActive: () => editor.value.isActive('bold'),
  },
  {
    type: 'button',
    icon: IconItalic,
    title: 'Italic',
    action: () => editor.value.chain().focus().toggleItalic().run(),
    isActive: () => editor.value.isActive('italic'),
  },
  {
    type: 'button',
    icon: IconStrikethrough,
    title: 'Strike',
    action: () => editor.value.chain().focus().toggleStrike().run(),
    isActive: () => editor.value.isActive('strike'),
  },
  {
    type: 'button',
    icon: IconCode,
    title: 'Inline code',
    action: () => editor.value.chain().focus().toggleCode().run(),
    isActive: () => editor.value.isActive('code'),
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    icon: IconH1,
    title: 'Heading 1',
    action: () => editor.value.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: () => editor.value.isActive('heading', { level: 1 }),
  },
  {
    type: 'button',
    icon: IconH2,
    title: 'Heading 2',
    action: () => editor.value.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: () => editor.value.isActive('heading', { level: 2 }),
  },
  {
    type: 'button',
    icon: IconH3,
    title: 'Heading 3',
    action: () => editor.value.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: () => editor.value.isActive('heading', { level: 3 }),
  },
  {
    type: 'button',
    icon: IconH4,
    title: 'Heading 4',
    action: () => editor.value.chain().focus().toggleHeading({ level: 4 }).run(),
    isActive: () => editor.value.isActive('heading', { level: 4 }),
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    icon: IconList,
    title: 'Bullet list',
    action: () => editor.value.chain().focus().toggleBulletList().run(),
    isActive: () => editor.value.isActive('bulletList'),
  },
  {
    type: 'button',
    icon: IconListNumbers,
    title: 'Ordered list',
    action: () => editor.value.chain().focus().toggleOrderedList().run(),
    isActive: () => editor.value.isActive('orderedList'),
  },
  {
    type: 'button',
    icon: IconCodePlus,
    title: 'Code block',
    action: () => editor.value.chain().focus().toggleCodeBlock().run(),
    isActive: () => editor.value.isActive('codeBlock'),
  },

  {
    type: 'button',
    icon: IconBlockquote,
    title: 'Blockquote',
    action: () => editor.value.chain().focus().toggleBlockquote().run(),
    isActive: () => editor.value.isActive('blockquote'),
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    icon: IconTextWrap,
    title: 'Hard break',
    action: () => editor.value.chain().focus().setHardBreak().run(),
  },
  {
    type: 'button',
    icon: IconClearFormatting,
    title: 'Clear format',
    action: () => editor.value.chain().focus().clearNodes().unsetAllMarks().run(),
  },

  {
    type: 'button',
    icon: IconArrowBack,
    title: 'Undo',
    action: () => editor.value.chain().focus().undo().run(),
  },
  {
    type: 'button',
    icon: IconArrowForwardUp,
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
