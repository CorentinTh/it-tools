<script setup lang="ts">
import { computed, ref } from 'vue';
import { VueShikiInput, fetchShikiBundles } from 'vue-shiki-input';
import shiki from 'shiki';
import 'vue-shiki-input/style.css';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { useCopy, useCopyClipboardItems } from '@/composable/copy';

const text = ref('');

const shikiLoading = ref(false);

const themes = ref<{ id: string; displayName: string; type: 'dark' | 'light' }[]>([]);
const langs = ref<{ id: string; name: string }[]>([]);

const currentTheme = useQueryParamOrStorage({ name: 'theme', storageName: 'code-highlighter:theme', defaultValue: 'dark-plus' });
const themeDark = computed(() => {
  if (!currentTheme.value) {
    return false;
  }
  const index = themes.value.findIndex(theme => theme.id === currentTheme.value);
  return themes.value[index].type === 'dark';
});
const isDarkTheme = useDark();

watch(themeDark, isDark => isDarkTheme.value = isDark);

const currentLang = useQueryParamOrStorage({ name: 'lang', storageName: 'code-highlighter:lang', defaultValue: 'typescript' });
const showLineNumbers = ref(false);

(async () => {
  const { bundledLanguagesInfo, bundledThemesInfo } = await fetchShikiBundles();
  themes.value = bundledThemesInfo.map(item => ({
    value: item.id,
    label: item.displayName,
    type: item.type,
  }));
  langs.value = bundledLanguagesInfo.map(item => ({
    value: item.id,
    label: item.name,
  }));
})();

const htmlClipboardItem = computedAsync(async () => {
  const currentThemeValue = currentTheme.value;
  const currentLangValue = currentLang.value;
  const textValue = text.value;

  const highlighter = await shiki.getHighlighter({
    themes: [currentThemeValue],
    langs: [currentLangValue],
  });
  const code = highlighter.codeToHtml(textValue, currentLangValue, currentThemeValue);
  return [{
    mime: 'text/html',
    content: code,
  }];
});
const { copy: copyHtml } = useCopyClipboardItems({ source: htmlClipboardItem });
const { copy: copyText } = useCopy({ source: text });

function downloadBlob(blob: Blob, name: string) {
  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create an anchor element to trigger the download
  const a = document.createElement('a');
  a.href = url;
  // Set file name
  a.download = name;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();

  // Clean up by removing the anchor and revoking the URL
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function exportSVG() {
  const currentThemeValue = currentTheme.value;
  const currentLangValue = currentLang.value;
  const textValue = text.value;

  const highlighter = await shiki.getHighlighter({
    themes: [currentThemeValue],
    langs: [currentLangValue],
  });
  const renderer = await shiki.getSVGRenderer({
    fontFamily: 'monospace',
    fontSize: 14,
  });

  const tokens = highlighter.codeToThemedTokens(textValue, currentLangValue, currentThemeValue);
  const blob = new Blob(
    [
      renderer.renderToSVG(tokens, {
        bg: highlighter.getBackgroundColor(currentThemeValue),
      }),
    ],
    { type: 'image/svg+xml;charset=utf-8' },
  );

  downloadBlob(blob, `${currentLangValue}-${currentThemeValue}.svg`);
}
</script>

<template>
  <div>
    <n-form-item label="Show line numbers" label-placement="left">
      <n-switch v-model:value="showLineNumbers" />
    </n-form-item>
    <c-select
      v-model:value="currentLang"
      label="Language"
      label-position="left"
      searchable
      :options="langs"
      mb-2
    />
    <c-select
      v-model:value="currentTheme"
      label="Theme"
      label-position="left"
      searchable
      :options="themes"
      mb-2
    />

    <div flex justify-center>
      <c-button @click="copyHtml()">
        Copy HTML Formatted
      </c-button>
      <c-button @click="copyText()">
        Copy Code Text
      </c-button>
    </div>
    <VueShikiInput
      v-model="text"
      v-model:loading="shikiLoading"
      :code-to-html-options="{
        lang: currentLang!,
        theme: currentTheme!,
      }"
      :offset="{
        x: 10,
        y: 10,
      }"
      :line-numbers="showLineNumbers"
      auto-background focus
    />
  </div>
</template>
