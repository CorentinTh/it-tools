<script setup lang="ts">
import * as monacoEditor from 'monaco-editor';
import type { MonacoEditor } from '@guolao/vue-monaco-editor';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import { useStyleStore } from '@/stores/style.store';

const props = withDefaults(defineProps<EditorProps>(), {
  theme: 'vs',
  options: () => ({}),
  overrideServices: () => ({}),
  saveViewState: true,
  width: '100%',
  height: '100%',
});

const emits = defineEmits<{
  (e: 'update:value', value: string | undefined): void
  (e: 'beforeMount', monaco: MonacoEditor): void
  (e: 'mount', editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: MonacoEditor): void
  (e: 'change', value: string | undefined, event: monacoEditor.editor.IModelContentChangedEvent): void
  (e: 'validate', markers: monacoEditor.editor.IMarker[]): void
}>();

interface MonacoEnvironment {
  getWorker(_: any, label: string): Worker
}
// eslint-disable-next-line @typescript-eslint/no-namespace
declare module globalThis {
  let MonacoEnvironment: MonacoEnvironment;
}

const value = useVModel(props, 'value', emits);

globalThis.MonacoEnvironment = {
  getWorker(_: any, label: string) {
    if (label === 'json') {
      return new JsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new CssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new HtmlWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      return new TsWorker();
    }
    return new EditorWorker();
  },
};

export interface EditorProps {
  defaultValue?: string
  defaultPath?: string
  defaultLanguage?: string
  value?: string
  language?: string
  path?: string

  /* === */

  theme: 'vs' | string
  line?: number
  options?: monacoEditor.editor.IStandaloneEditorConstructionOptions
  overrideServices?: monacoEditor.editor.IEditorOverrideServices
  saveViewState?: boolean

  /* === */

  width?: number | string
  height?: number | string
  className?: string
}

monacoEditor.editor.defineTheme('it-tools-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#00000000',
  },
});

monacoEditor.editor.defineTheme('it-tools-light', {
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
  isDarkTheme => monacoEditor.editor.setTheme(isDarkTheme ? 'it-tools-dark' : 'it-tools-light'),
  { immediate: true },
);

const attrs = useAttrs();
const inheritedAttrs = { ...attrs, ...props };
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<template>
  <vue-monaco-editor
    v-bind="inheritedAttrs"
    v-model:value="value"
    @before-mount="(monaco: MonacoEditor) => emits('beforeMount', monaco)"
    @mount="(editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: MonacoEditor) => emits('mount', editor, monaco)"
    @change="(value: string | undefined, event: monacoEditor.editor.IModelContentChangedEvent) => emits('change', value, event)"
    @validate="(markers: monacoEditor.editor.IMarker[]) => emits('validate', markers)"
  />
</template>
