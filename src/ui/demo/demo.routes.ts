import type { RouteRecordRaw } from 'vue-router';

const demoPages = import.meta.glob('../*/*.demo.vue');

export const demoRoutes = Object.keys(demoPages).map((path) => {
  const [, , fileName] = path.split('/');
  const name = fileName.split('.').shift();

  console.log(path);

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
    children: demoRoutes,
    component: () => import('./demo-wrapper.vue'),
  },
];
