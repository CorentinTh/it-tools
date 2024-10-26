import toolsModule from './src/modules/tools/modules/tools.modules';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  extends: [
    'src/modules/app',
  ],

  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
    toolsModule, // Must be imported before i18n
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@pinia/nuxt',
  ],

  site: {
    url: 'https://it-tools.tech',
    name: 'IT Tools',
    description: 'The open-source collection of handy online tools to help developers in their daily life.',
  },

  fonts: {
    provider: 'bunny',
    defaults: {
      weights: [400, 500, 600, 700, 800],
    },
  },

  colorMode: {
    preference: 'system',
    fallback: 'dark',
    classSuffix: '',
    storage: 'cookie',
    storageKey: 'itts-color-mode',
  },

  i18n: {
    strategy: 'prefix',
    vueI18n: './i18n.config.ts',
    defaultLocale: 'en',
    langDir: './src/locales',
    locales: [
      { code: 'en', file: 'en.yaml', name: 'English' },
      { code: 'fr', file: 'fr.yaml', name: 'Français' },
    ],
  },
});
