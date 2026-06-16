<script setup lang="ts">
import { toCSharp, toGo, toJava, toJavaScript, toNode, toPhp, toPython, toRust } from 'curlconverter';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { withDefaultOnError } from '@/utils/defaults';

const converters: Record<string, { fn: (cmd: string) => string; hlLang: string }> = {
  python: { fn: toPython, hlLang: 'python' },
  javascript: { fn: toJavaScript, hlLang: 'javascript' },
  node: { fn: toNode, hlLang: 'javascript' },
  go: { fn: toGo, hlLang: 'go' },
  php: { fn: toPhp, hlLang: 'php' },
  java: { fn: toJava, hlLang: 'java' },
  csharp: { fn: toCSharp, hlLang: 'csharp' },
  rust: { fn: toRust, hlLang: 'rust' },
};

const languages = [
  { label: 'Python (requests)', value: 'python' },
  { label: 'JavaScript (fetch)', value: 'javascript' },
  { label: 'Node.js (http)', value: 'node' },
  { label: 'Go (net/http)', value: 'go' },
  { label: 'PHP (cURL)', value: 'php' },
  { label: 'Java (OkHttp)', value: 'java' },
  { label: 'C# (HttpClient)', value: 'csharp' },
  { label: 'Rust (reqwest)', value: 'rust' },
];

const selectedLanguage = ref('python');
const curlInput = ref('curl https://example.com');

const output = computed(() =>
  withDefaultOnError(() => {
    if (!curlInput.value.trim()) {
      return '';
    }
    return converters[selectedLanguage.value].fn(curlInput.value);
  }, ''),
);

const outputLanguage = computed(() => converters[selectedLanguage.value]?.hlLang ?? 'txt');
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="max-width: 600px" mx-auto mb-5>
      <c-select
        v-model:value="selectedLanguage"
        label="Target language"
        :options="languages"
      />
    </div>
  </div>

  <n-form-item label="Your cURL command">
    <c-input-text
      v-model:value="curlInput"
      placeholder="Paste your cURL command here..."
      rows="5"
      multiline
      monospace
      raw-text
    />
  </n-form-item>

  <n-form-item label="Generated code">
    <TextareaCopyable :value="output" :language="outputLanguage" />
  </n-form-item>
</template>
