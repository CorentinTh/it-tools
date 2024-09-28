<script setup lang="ts">
import { computed, ref } from 'vue';
import { bundledLanguagesInfo, createHighlighter } from 'shiki/bundle/full';
import { bundledThemesInfo } from 'shiki/themes';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { useCopy, useCopyClipboardItems } from '@/composable/copy';

const code = ref(`// Using 'typeof' to infer types
const person = { name: "Alice", age: 30 };
type PersonType = typeof person;  // { name: string; age: number }

// 'satisfies' to ensure a type matches but allows more specific types
type Animal = { name: string };
const dog = { name: "Buddy", breed: "Golden Retriever" } satisfies Animal;

// Generics with 'extends' and default values
function identity<T extends number | string = string>(arg: T): T {
  return arg;
}`);

const themes = ref<{ value: string; label: string }[]>(
  bundledThemesInfo.map((item) => {
    return {
      value: item.id,
      label: item.displayName,
    };
  }));
const langs = ref<{ value: string; label: string }[]>(
  bundledLanguagesInfo.map(item => ({
    value: item.id,
    label: item.name,
  })));

const currentTheme = useQueryParamOrStorage({ name: 'theme', storageName: 'code-highlighter:theme', defaultValue: 'dark-plus' });
const currentLang = useQueryParamOrStorage({ name: 'lang', storageName: 'code-highlighter:lang', defaultValue: 'typescript' });

const showLineNumbers = ref(false);

const formattedCodeHtml = computedAsync(async () => {
  const currentThemeValue = currentTheme.value;
  const currentLangValue = currentLang.value;
  const codeValue = code.value;
  const needLineNumbers = showLineNumbers.value;

  const lineNumberWidth = Math.log10(codeValue.split('\n').length) + 2;

  const highlighter = await createHighlighter(
    {
      langs: [currentLangValue],
      themes: [currentThemeValue],
    });
  return highlighter.codeToHtml(codeValue, {
    lang: currentLangValue,
    theme: currentThemeValue,
    transformers: [
      {
        postprocess(html: string) {
          // when copied to clipboard and pasted to LibreOffice,
          // formatting of first line is only kept if there is a line break before...
          const ensureFirstLineFormattedWhenCopied
              = (html: string) => html.replace('<code>', '<code>\n');
          if (!needLineNumbers) {
            return ensureFirstLineFormattedWhenCopied(html);
          }
          let lineNumber = 1;
          return html.replace(/<span class="line/g, (m) => {
            const lineNumberFormatted = (lineNumber++).toString().padStart(lineNumberWidth, ' ');
            return `<span class="line-number" style="white-space-collapse: preserve">${lineNumberFormatted}  </span>${m}`;
          }).replace('<code>', '<code>\n');
        },
      },
    ],
  });
});
const htmlClipboardItems = computed(() => [{
  mime: 'text/html',
  content: formattedCodeHtml.value,
}]);
const { copy: copyHtml } = useCopyClipboardItems({ source: htmlClipboardItems });
const { copy: copyText } = useCopy({ source: code });
</script>

<template>
  <div>
    <div mb-3 flex items-baseline gap-1>
      <c-select
        v-model:value="currentLang"
        label="Language"
        label-position="left"
        searchable
        :options="langs"
        flex-1
      />
      <c-select
        v-model:value="currentTheme"
        label="Theme"
        label-position="left"
        searchable
        :options="themes"
        flex-1
      />
    </div>

    <c-input-text
      v-model:value="code"
      label="Code snippet to format:"
      multiline
      placeholder="Put your code snippet here"
      rows="5"
      mb-3
    />

    <div flex justify-center gap-2>
      <n-form-item label="Show line numbers" label-placement="left">
        <n-switch v-model:value="showLineNumbers" />
      </n-form-item>
      <c-button @click="copyHtml()">
        Copy HTML Formatted
      </c-button>
      <c-button @click="copyText()">
        Copy Code Text
      </c-button>
    </div>

    <div v-html="formattedCodeHtml" /><!-- //NOSONAR -->
  </div>
</template>

<style scoped>
::v-deep(.line-number) {
  text-wrap: nowrap;
}
</style>
