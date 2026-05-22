<script setup lang="ts">
import * as monaco from 'monaco-editor';
import { useStyleStore } from '@/stores/style.store';

const props = withDefaults(
  defineProps<{
    options?: monaco.editor.IDiffEditorOptions
    original?: string
    modified?: string
    language?: string
    height?: string
    testId?: string
  }>(),
  {
    options: () => ({}),
    original: 'original text',
    modified: 'modified text',
    language: 'txt',
    height: '600px',
    testId: undefined,
  },
);
const emit = defineEmits<{
  'update:original': [value: string]
  'update:modified': [value: string]
}>();
const { options, original, modified, language, height, testId } = toRefs(props);

const editorContainer = ref<HTMLElement | null>(null);
let editor: monaco.editor.IStandaloneDiffEditor | null = null;
let originalModel: monaco.editor.ITextModel | null = null;
let modifiedModel: monaco.editor.ITextModel | null = null;
let modelListeners: monaco.IDisposable[] = [];

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

watch(original, (value) => {
  if (originalModel && originalModel.getValue() !== value) {
    originalModel.setValue(value);
  }
});

watch(modified, (value) => {
  if (modifiedModel && modifiedModel.getValue() !== value) {
    modifiedModel.setValue(value);
  }
});

watch(language, (value) => {
  if (originalModel) {
    monaco.editor.setModelLanguage(originalModel, value);
  }

  if (modifiedModel) {
    monaco.editor.setModelLanguage(modifiedModel, value);
  }
});

useResizeObserver(editorContainer, () => {
  editor?.layout();
});

onMounted(() => {
  if (!editorContainer.value) {
    return;
  }

  editor = monaco.editor.createDiffEditor(editorContainer.value, {
    originalEditable: true,
    minimap: {
      enabled: false,
    },
    ...options.value,
  });

  originalModel = monaco.editor.createModel(original.value, language.value);
  modifiedModel = monaco.editor.createModel(modified.value, language.value);

  editor.setModel({
    original: originalModel,
    modified: modifiedModel,
  });

  modelListeners = [
    originalModel.onDidChangeContent(() => emit('update:original', originalModel?.getValue() ?? '')),
    modifiedModel.onDidChangeContent(() => emit('update:modified', modifiedModel?.getValue() ?? '')),
  ];
});

onBeforeUnmount(() => {
  modelListeners.forEach(listener => listener.dispose());
  editor?.dispose();
  originalModel?.dispose();
  modifiedModel?.dispose();
});
</script>

<template>
  <div ref="editorContainer" :data-test-id="testId" :style="{ height }" />
</template>
