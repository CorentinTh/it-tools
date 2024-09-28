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
  ColorPicker,
  ColumnInsertLeft,
  ColumnInsertRight,
  Cross,
  H1,
  H2,
  H3,
  H4,
  Heading,
  Italic,
  LayersIntersect2,
  LayersUnion,
  LayoutDistributeHorizontal,
  LayoutDistributeVertical,
  List,
  ListNumbers,
  RowInsertBottom,
  RowInsertTop,
  SeparatorVertical, Strikethrough, Table, TableOff, TextWrap, Tool,
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
    value?: () => string
    isActive?: () => boolean
    enabled?: () => boolean
    type: 'button'
  }
  | {
    icon: Component
    title: string
    action: (color: string) => void
    value: () => string
    type: 'color'
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
    type: 'divider',
  },
  {
    type: 'color',
    title: 'Forecolor',
    icon: ColorPicker,
    action: color => editor.value.chain().focus().setColor(color).run(),
    value: () => editor.value.getAttributes('textStyle').color,
  },
  {
    type: 'button',
    icon: ClearFormatting,
    title: 'Clear Forecolor',
    action: () => editor.value.chain().focus().unsetColor().run(),
  },
  {
    type: 'divider',
  },
  {
    type: 'color',
    title: 'Highlight color',
    icon: ColorPicker,
    action: color => editor.value.chain().focus().setHighlight({ color }).run(),
    value: () => '#FAF594',
  },
  {
    type: 'button',
    icon: ClearFormatting,
    title: 'Clear Highlight',
    action: () => editor.value.chain().focus().unsetHighlight().run(),
    isActive: () => editor.value.isActive('highlight'),
  },
  {
    type: 'divider',
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
  {
    type: 'divider',
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    enabled: () => editor.value.can().insertTable(),
    title: 'Insert table',
    icon: Table,
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().addColumnBefore().run(),
    enabled: () => editor.value.can().addColumnBefore(),
    title: 'Add column before',
    icon: ColumnInsertLeft,
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().addColumnAfter().run(),
    enabled: () => editor.value.can().addColumnAfter(),
    title: 'Add column after',
    icon: ColumnInsertRight,
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().deleteColumn().run(),
    enabled: () => editor.value.can().deleteColumn(),
    title: 'Delete column',
    icon: Cross,
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().addRowBefore().run(),
    enabled: () => editor.value.can().addRowBefore(),
    title: 'Add row before',
    icon: RowInsertTop,
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().addRowAfter().run(),
    enabled: () => editor.value.can().addRowAfter(),
    title: 'Add row after',
    icon: RowInsertBottom,
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().deleteRow().run(),
    enabled: () => editor.value.can().deleteRow(),
    title: 'Delete row',
    icon: Cross,
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().deleteTable().run(),
    enabled: () => editor.value.can().deleteTable(),
    title: 'Delete table',
    icon: TableOff,
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().mergeCells().run(),
    enabled: () => editor.value.can().mergeCells(),
    title: 'Merge cells',
    icon: LayersUnion,
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().splitCell().run(),
    enabled: () => editor.value.can().splitCell(),
    title: 'Split cell',
    icon: SeparatorVertical,
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().mergeOrSplit().run(),
    enabled: () => editor.value.can().mergeOrSplit(),
    title: 'Merge or split',
    icon: LayersIntersect2,
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().toggleHeaderColumn().run(),
    enabled: () => editor.value.can().toggleHeaderColumn(),
    title: 'Toggle header column',
    icon: LayoutDistributeVertical,
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().toggleHeaderRow().run(),
    enabled: () => editor.value.can().toggleHeaderRow(),
    title: 'Toggle header row',
    icon: LayoutDistributeHorizontal,
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().toggleHeaderCell().run(),
    enabled: () => editor.value.can().toggleHeaderCell(),
    title: 'Toggle header cell',
    icon: Heading,
  },
  {
    type: 'divider',
  },
  {
    type: 'button',
    action: () => editor.value.chain().focus().fixTables().run(),
    enabled: () => editor.value.can().fixTables(),
    title: 'Fix tables',
    icon: Tool,
  },
];
</script>

<template>
  <div flex flex-wrap items-center>
    <template v-for="(item, index) in items">
      <n-divider v-if="item.type === 'divider'" :key="`divider${index}`" vertical />
      <MenuBarItem v-else-if="item.type === 'button'" :key="index" v-bind="item" />
      <c-tooltip
        v-if="item.type === 'color'" :key="`color${index}`"
        :tooltip="item.title"
      >
        <n-color-picker
          style="width: 120px"
          :show-alpha="false"
          :actions="['confirm']"
          :value="item.value()"
          @confirm="item.action"
        />
      </c-tooltip>
    </template>
  </div>
</template>
