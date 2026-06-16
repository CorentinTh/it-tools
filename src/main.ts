import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';

import { registerSW } from 'virtual:pwa-register';
import shadow from 'vue-shadow-dom';
import { plausible } from './plugins/plausible.plugin';

import 'virtual:uno.css';

import { naive } from './plugins/naive.plugin';

import App from './App.vue';
import router from './router';
import { i18nPlugin } from './plugins/i18n.plugin';

registerSW();

// Reload the page the moment a newly installed service worker takes control.
// vite-plugin-pwa's autoUpdate relies on the Workbox `activated(isUpdate)` event, but
// with `skipWaiting` the new SW can install→activate so fast that Workbox-window never
// attaches its lifecycle listeners and `activated` is missed — leaving users stuck on
// stale content until a hard refresh. `controllerchange` is fired directly by the
// browser when the new SW calls `clients.claim()`, so it fires reliably regardless of
// that race. We only reload on an actual handover (controller already existed), not on
// the very first install.
if ('serviceWorker' in navigator) {
  const hadController = navigator.serviceWorker.controller !== null;
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || refreshing) {
      return;
    }
    refreshing = true;
    globalThis.location.reload();
  });
}

const app = createApp(App);

app.use(createPinia());
app.use(createHead());
app.use(i18nPlugin);
app.use(router);
app.use(naive);
app.use(plausible);
app.use(shadow);

app.mount('#app');
