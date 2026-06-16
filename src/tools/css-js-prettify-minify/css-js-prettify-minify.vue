<script setup lang="ts">
import { css as cssBeautify, js as jsBeautify } from 'js-beautify';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useStyleStore } from '@/stores/style.store';
import { withDefaultOnError } from '@/utils/defaults';

const styleStore = useStyleStore();

const languages = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'CSS', value: 'css' },
] as { label: string; value: string }[];

const selectedLanguage = ref('javascript');
const indentSize = ref('2');

const prettifyInput = ref('');
const minifyInput = ref('');

const prettifyOutput = computed(() =>
  withDefaultOnError(() => {
    if (!prettifyInput.value) {
      return '';
    }
    const opts = { indent_size: Number.parseInt(indentSize.value, 10) || 2 };
    return selectedLanguage.value === 'css'
      ? cssBeautify(prettifyInput.value, opts)
      : jsBeautify(prettifyInput.value, opts);
  }, ''),
);

function minifyCss(input: string): string {
  return input
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/ ?([{}:;,>~+]) ?/g, '$1')
    .replaceAll(';}', '}')
    .trim();
}

function minifyJs(input: string): string {
  return input
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '')
    .replace(/\s+/g, ' ')
    .replace(/ ?([{}();,=:+\-*/<>!&|?]) ?/g, '$1')
    .trim();
}

const minifyOutput = computed(() =>
  withDefaultOnError(() => {
    if (!minifyInput.value) {
      return '';
    }
    return selectedLanguage.value === 'css'
      ? minifyCss(minifyInput.value)
      : minifyJs(minifyInput.value);
  }, ''),
);
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="max-width: 600px" :class="{ 'flex-col': styleStore.isSmallScreen }" mx-auto mb-5 flex gap-2>
      <c-select
        v-model:value="selectedLanguage"
        label="Language"
        style="flex: 1"
        :options="languages"
      />
      <c-input-text
        v-model:value="indentSize"
        label="Indent size"
        placeholder="2"
        style="flex: 1"
      />
    </div>
  </div>

  <c-card title="Prettify">
    <n-form-item label="Your code">
      <c-input-text
        v-model:value="prettifyInput"
        placeholder="Paste your code to prettify..."
        rows="10"
        multiline
        monospace
        raw-text
      />
    </n-form-item>
    <n-form-item label="Prettified code">
      <TextareaCopyable :value="prettifyOutput" :language="selectedLanguage" />
    </n-form-item>
  </c-card>

  <c-card title="Minify" mt-5>
    <n-form-item label="Your code">
      <c-input-text
        v-model:value="minifyInput"
        placeholder="Paste your code to minify..."
        rows="10"
        multiline
        monospace
        raw-text
      />
    </n-form-item>
    <n-form-item label="Minified code">
      <TextareaCopyable :value="minifyOutput" :language="selectedLanguage" />
    </n-form-item>
  </c-card>
</template>
