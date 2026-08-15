import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';

import { registerSW } from 'virtual:pwa-register';
import shadow from 'vue-shadow-dom';
import { plausible } from './plugins/plausible.plugin';

import 'virtual:uno.css';
import './ui/theme/tokens.css';

import { naive } from './plugins/naive.plugin';

import App from './App.vue';
import router from './router';
import { installOfflineRouteRecovery } from './modules/pwa/offline-route-recovery';
import { configurePwaRuntime } from './modules/pwa/runtime';
import { i18nPlugin } from './plugins/i18n.plugin';
import { clearLegacySensitiveContentStorage } from './utils/sensitive-content-storage';

clearLegacySensitiveContentStorage();
installOfflineRouteRecovery(router);

if (import.meta.env.DEV) {
  void configurePwaRuntime({
    baseUrl: import.meta.env.BASE_URL,
    cacheStorage: 'caches' in window ? window.caches : undefined,
    isDevelopment: true,
    origin: window.location.origin,
    registerServiceWorker: registerSW,
    reload: () => window.location.reload(),
    serviceWorker: 'serviceWorker' in navigator ? navigator.serviceWorker : undefined,
    sessionStorage: window.sessionStorage,
  }).catch(() => undefined);
}
else {
  registerSW();
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
