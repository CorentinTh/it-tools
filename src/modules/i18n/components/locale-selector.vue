<script setup lang="ts">
import CSelect from '@/ui/c-select/c-select.vue';

const { availableLocales, locale } = useI18n();

const localesLong: Record<string, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  pt: 'Português',
  ru: 'Русский',
  uk: 'Українська',
  zh: '中文',
  vi: 'Tiếng Việt',
};

const localeOptions = computed(() =>
  availableLocales.map(locale => ({
    label: localesLong[locale] ?? locale,
    value: locale,
  })),
);
</script>

<template>
  <CSelect
    v-model:value="locale"
    :options="localeOptions"
    placeholder="Select a language"
    w-100px
  />
</template>
