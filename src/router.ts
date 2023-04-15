import type { RouteRecordRaw } from 'vue-router';
import HomePage from './pages/Home.page.vue';
// import { layouts } from './layouts/index';
import NotFound from './pages/404.page.vue';
// import { tools } from './tools';

// const toolsRoutes = tools.map(({ path, name, component, ...config }) => ({
//   path,
//   name,
//   component,
//   meta: { isTool: true, layout: layouts.toolLayout, name, ...config },
// }));
// const toolsRedirectRoutes = tools
//   .filter(({ redirectFrom }) => redirectFrom && redirectFrom.length > 0)
//   .flatMap(
//     ({ path, redirectFrom }) => redirectFrom?.map((redirectSource) => ({ path: redirectSource, redirect: path })) ?? [],
//   );
//
// console.log({ toolsRoutes, toolsRedirectRoutes });

const routes: RouteRecordRaw[] = [
  // ...toolsRoutes,
  // ...toolsRedirectRoutes,
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   component: () => import('./pages/About.vue'),
  // },

  // { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

export { routes };
