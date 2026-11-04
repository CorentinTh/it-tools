import { createHead } from '@unhead/vue/client';
import { createPinia } from 'pinia';
import { registerSW } from 'virtual:pwa-register';

import { createApp } from 'vue';
import shadow from 'vue-shadow-dom';
import App from './App.vue';

import { i18nPlugin } from './plugins/i18n.plugin';

import { naive } from './plugins/naive.plugin';

import { plausible } from './plugins/plausible.plugin';
import router from './router';
import 'virtual:uno.css';

registerSW();

const app = createApp(App);

app.use(createPinia());
app.use(createHead());
app.use(i18nPlugin);
app.use(router);
app.use(naive);
app.use(plausible);
app.use(shadow);

app.mount('#app');
