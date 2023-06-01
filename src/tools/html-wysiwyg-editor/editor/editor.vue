<script setup lang="ts">
import { tryOnBeforeUnmount, useVModel } from '@vueuse/core';
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { useThemeVars } from 'naive-ui';
import MenuBar from './menu-bar.vue';

const props = defineProps<{ html: string }>();
const emit = defineEmits(['update:html']);
const themeVars = useThemeVars();
const html = useVModel(props, 'html', emit);

const editor = new Editor({
  content: html.value,
  extensions: [StarterKit],
});

editor.on('update', ({ editor }) => emit('update:html', editor.getHTML()));

tryOnBeforeUnmount(() => {
  editor.destroy();
});
</script>

<template>
  <c-card v-if="editor" important:p0>
    <MenuBar class="editor-header" :editor="editor" />
    <n-divider style="margin-top: 0" />

    <div px8 pb6>
      <EditorContent class="editor-content" :editor="editor" />
    </div>
  </c-card>
</template>

<style scoped lang="less">
::v-deep(.ProseMirror-focused) {
  outline: none;
}
</style>

<style scoped lang="less">
::v-deep(.ProseMirror) {
  > * + * {
    margin-top: 0.75em;
  }

  p {
    margin: 0;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: v-bind('themeVars.codeColor');
    padding: 2px 4px;
    border-radius: 5px;
    font-size: 85%;
  }

  pre {
    background: v-bind('themeVars.codeColor');
    font-family: monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  mark {
    background-color: #faf594;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  hr {
    margin: 1rem 0;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0d0d0d, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0d0d0d, 0.1);
    margin: 2rem 0;
  }

  ul[data-type='taskList'] {
    list-style: none;
    padding: 0;

    li {
      display: flex;
      align-items: center;

      > label {
        flex: 0 0 auto;
        margin-right: 0.5rem;
        user-select: none;
      }

      > div {
        flex: 1 1 auto;
      }
    }
  }
}
</style>
