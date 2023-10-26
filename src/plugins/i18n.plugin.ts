import type { Plugin } from 'vue';
import { createI18n } from 'vue-i18n';
import baseMessages from '@intlify/unplugin-vue-i18n/messages';
import _ from 'lodash';
import { parse as parseYaml } from 'yaml';

const i18nFiles = import.meta.glob('../tools/*/locales/**.yml', { as: 'raw' });

const messagesByTools = await Promise.all(_.map(i18nFiles, async (fileDescriptor, path) => {
  const [, locale] = path.match(/\.\/tools\/.*?\/locales\/(.*)\.ya?ml$/i) ?? [];
  const content = parseYaml(await fileDescriptor());

  return { [locale]: content };
}));

const messages = _.merge(
  baseMessages,
  _.merge({}, ...messagesByTools),
);

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages,
});

export const i18nPlugin: Plugin = {
  install: (app) => {
    app.use(i18n);
  },
};

export const translate = function (localeKey: string) {
  // @ts-expect-error global
  const hasKey = i18n.global.te(localeKey, i18n.global.locale);
  return hasKey ? i18n.global.t(localeKey) : localeKey;
};
