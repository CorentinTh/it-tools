<script setup lang="ts">
import * as monaco from 'monaco-editor';
import { useStorage } from '@vueuse/core';
import { useStyleStore } from '@/stores/style.store';

const props = withDefaults(defineProps<{ options?: monaco.editor.IDiffEditorOptions }>(), { options: () => ({}) });
const { options } = toRefs(props);

const editorContainer = ref<HTMLElement | null>(null);
let editor: monaco.editor.IStandaloneDiffEditor | null = null;

monaco.editor.defineTheme('it-tools-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#00000000',
  },
});

monaco.editor.defineTheme('it-tools-light', {
  base: 'vs',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#00000000',
  },
});

const styleStore = useStyleStore();

watch(
  () => styleStore.isDarkTheme,
  isDarkTheme => monaco.editor.setTheme(isDarkTheme ? 'it-tools-dark' : 'it-tools-light'),
  { immediate: true },
);

watch(
  () => options.value,
  options => editor?.updateOptions(options),
  { immediate: true, deep: true },
);

useResizeObserver(editorContainer, () => {
  editor?.layout();
});

const originalText = useStorage('text-diff:original', 'original text');
const modifiedText = useStorage('text-diff:modified', 'modified text');

onMounted(() => {
  if (!editorContainer.value) {
    return;
  }

  editor = monaco.editor.createDiffEditor(editorContainer.value, {
    originalEditable: true,
    minimap: {
      enabled: false,
    },
  });

  const original = monaco.editor.createModel(originalText.value);
  original.onDidChangeContent(() => {
    originalText.value = editor.getOriginalEditor().getValue();
  });

  const modified = monaco.editor.createModel(modifiedText.value);
  modified.onDidChangeContent(() => {
    modifiedText.value = editor.getModifiedEditor().getValue();
  });

  editor.setModel({
    original,
    modified,
  });
});
</script>

<template>
  <div ref="editorContainer" h-600px />
</template>
