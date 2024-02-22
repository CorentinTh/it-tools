import messages from '@intlify/unplugin-vue-i18n/messages';
import { get } from '@vueuse/core';
import type { Plugin } from 'vue';
import { createI18n } from 'vue-i18n';

const localeLang = navigator.language || navigator.languages[0] || 'en';

const i18n = createI18n({
  legacy: false,
  locale: localeLang.split('-')[0],
  fallbackLocale: 'en',
  messages,
});

export const i18nPlugin: Plugin = {
  install: (app) => {
    app.use(i18n);
  },
};

export const translate = function (localeKey: string, named: Record<string, unknown> = {}) {
  const hasKey = i18n.global.te(localeKey, get(i18n.global.locale));
  return hasKey ? i18n.global.t(localeKey, named) : localeKey;
};
