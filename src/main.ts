import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';

import { install as VueMonacoEditorPlugin, loader } from '@guolao/vue-monaco-editor';
import * as monaco from 'monaco-editor';

import { registerSW } from 'virtual:pwa-register';
import { plausible } from './plugins/plausible.plugin';

import 'virtual:uno.css';

import { naive } from './plugins/naive.plugin';

import App from './App.vue';
import router from './router';
import { i18nPlugin } from './plugins/i18n.plugin';

// loaded monaco-editor from `node_modules`
loader.config({ monaco });

registerSW();

const app = createApp(App);

app.use(VueMonacoEditorPlugin);
app.use(createPinia());
app.use(createHead());
app.use(i18nPlugin);
app.use(router);
app.use(naive);
app.use(plausible);

app.mount('#app');
