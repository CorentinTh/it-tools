<script setup lang="ts">
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { acquireMonacoWorkerEnvironment } from './monaco-worker-manager';
import { useStyleStore } from '@/stores/style.store';

const props = withDefaults(defineProps<{
  options?: monaco.editor.IDiffEditorOptions
  originalText?: string
  modifiedText?: string
}>(), {
  options: () => ({}),
  originalText: 'original text',
  modifiedText: 'modified text',
});
const emit = defineEmits<{
  (event: 'update:originalText', value: string): void
  (event: 'update:modifiedText', value: string): void
}>();
const { modifiedText, options, originalText } = toRefs(props);
const releaseWorkerEnvironment = acquireMonacoWorkerEnvironment();

const editorContainer = ref<HTMLElement | null>(null);
let editor: monaco.editor.IStandaloneDiffEditor | null = null;
let originalModel: monaco.editor.ITextModel | null = null;
let modifiedModel: monaco.editor.ITextModel | null = null;
let originalContentListener: monaco.IDisposable | null = null;
let modifiedContentListener: monaco.IDisposable | null = null;

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

const { stop: stopResizeObserver } = useResizeObserver(editorContainer, () => {
  editor?.layout();
});

watch(originalText, (value) => {
  if (originalModel && originalModel.getValue() !== value) {
    originalModel.setValue(value);
  }
});

watch(modifiedText, (value) => {
  if (modifiedModel && modifiedModel.getValue() !== value) {
    modifiedModel.setValue(value);
  }
});

onMounted(() => {
  if (!editorContainer.value) {
    return;
  }

  const mountedEditor = monaco.editor.createDiffEditor(editorContainer.value, {
    originalEditable: true,
    minimap: {
      enabled: false,
    },
  });
  editor = mountedEditor;

  originalModel = monaco.editor.createModel(originalText.value);
  originalContentListener = originalModel.onDidChangeContent(() => {
    emit('update:originalText', originalModel?.getValue() ?? '');
  });

  modifiedModel = monaco.editor.createModel(modifiedText.value);
  modifiedContentListener = modifiedModel.onDidChangeContent(() => {
    emit('update:modifiedText', modifiedModel?.getValue() ?? '');
  });

  mountedEditor.setModel({
    original: originalModel,
    modified: modifiedModel,
  });
});

function disposeEditorResources() {
  const mountedEditor = editor;
  const mountedOriginalModel = originalModel;
  const mountedModifiedModel = modifiedModel;
  const mountedOriginalContentListener = originalContentListener;
  const mountedModifiedContentListener = modifiedContentListener;

  originalContentListener = null;
  modifiedContentListener = null;
  originalModel = null;
  modifiedModel = null;
  editor = null;

  const cleanupSteps = [
    () => stopResizeObserver(),
    () => mountedOriginalContentListener?.dispose(),
    () => mountedModifiedContentListener?.dispose(),
    () => mountedEditor?.setModel(null),
    () => mountedEditor?.dispose(),
    () => mountedOriginalModel?.dispose(),
    () => mountedModifiedModel?.dispose(),
  ];
  let firstError: unknown;
  let cleanupFailed = false;

  for (const cleanup of cleanupSteps) {
    try {
      cleanup();
    }
    catch (error) {
      cleanupFailed = true;
      firstError ??= error;
    }
  }

  if (cleanupFailed) {
    throw firstError;
  }
}

onBeforeUnmount(disposeEditorResources);

// Scope cleanup still runs if mounting fails before the unmount hook can finish.
onScopeDispose(() => {
  try {
    disposeEditorResources();
  }
  finally {
    releaseWorkerEnvironment();
  }
});
</script>

<template>
  <div ref="editorContainer" h-600px />
</template>
