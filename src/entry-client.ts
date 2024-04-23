// entry-client.js
import { createApp } from './main';
import 'virtual:uno.css';

const { app, router } = createApp();

router.isReady().then(() => {
  app.mount('#app', true);
}).catch((err) => {
  console.log(err);
});
