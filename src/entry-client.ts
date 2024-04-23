// entry-client.js
import { createApp } from './main';

const { app, router } = createApp();

router.isReady().then(() => {
  app.mount('#app', true);
});
//
// // import 'uno.css'; // 确保这是你的 UnoCSS 生成的样式文件
//
// import { createHead } from '@vueuse/head';
//
// // src/entry-client.js
// import { createApp } from 'vue';
// import { createPinia } from 'pinia';
// import App from './App.vue';
// import router from '@/router';
// import { plausible } from '@/plugins/plausible.plugin';
// import { naive } from '@/plugins/naive.plugin';
// import { i18nPlugin } from '@/plugins/i18n.plugin';
//
// const app = createApp(App);
// const pinia = createPinia();
// app.use(pinia);
// app.use(createHead());
// app.use(i18nPlugin);
// app.use(router);
// app.use(plausible);
// app.use(naive);
//
// router.isReady().then(() => {
//   console.log('---- Router is ready, now mounting the app...');
//   app.mount('#app', true);
//   console.log('---- App has been mounted successfully.');
// }).catch((err) => {
//   console.log(err);
// });
