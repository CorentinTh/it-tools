import type { RouteRecordRaw } from 'vue-router';
import DemoHome from './demo-home.page.vue';

const demoPages = import.meta.glob('../*/*.demo.vue');

export const demoRoutes = Object.keys(demoPages).map((path) => {
  const [, , fileName] = path.split('/');
  const name = fileName.split('.').shift();

  return {
    path: name,
    name,
    component: () => import(/* @vite-ignore */ path),
  } as RouteRecordRaw;
});

export const routes = [
  {
    path: '/c-lib',
    name: 'c-lib',
    children: [
      {
        path: '',
        name: 'c-lib-index',
        component: DemoHome,
      },
      ...demoRoutes,
    ],
    component: () => import('./demo-wrapper.vue'),
  },
];
