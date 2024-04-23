import { createSSRApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';

// import { registerSW } from 'virtual:pwa-register';
import { plausible } from './plugins/plausible.plugin';

import { naive } from './plugins/naive.plugin';

import App from './App.vue';
import router from './router';
import { i18nPlugin } from './plugins/i18n.plugin';

// registerSW();

// const app = createApp(App);

// app.use(createPinia());
// app.use(createHead());
// app.use(i18nPlugin);
// app.use(router);
// app.use(naive);
// // app.use(plausible);
//
// app.mount('#app');
export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();
  app.use(pinia);
  app.use(createHead());
  app.use(i18nPlugin);
  app.use(router);
  app.use(plausible);
  app.use(naive);
  // 其他插件...

  return { app, router, pinia, i18n: i18nPlugin };
}
