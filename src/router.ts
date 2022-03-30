import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './pages/Home.page.vue';
import { tools } from './tools';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    ...Object.values(tools).flat(),
  ],
});

export default router;
