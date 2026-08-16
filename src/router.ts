import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import { tools } from '@tool-registry';
import { config } from './config';
import { applyRouteDocumentMetadata } from './modules/document-metadata';

const toolsRoutes = tools.map(({ path, name, component, ...config }) => ({
  path,
  name,
  component,
  meta: { isTool: true, name, ...config },
}));
const toolsRedirectRoutes = tools
  .filter(({ redirectFrom }) => redirectFrom && redirectFrom.length > 0)
  .flatMap(
    ({ path, redirectFrom }) => redirectFrom?.map(redirectSource => ({ path: redirectSource, redirect: path })) ?? [],
  );

const router = createRouter({
  history: import.meta.env.STANDALONE
    ? createWebHashHistory()
    : createWebHistory(config.app.baseUrl),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./pages/Home.page.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./pages/About.vue'),
    },
    ...toolsRoutes,
    ...toolsRedirectRoutes,
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('./pages/404.page.vue') },
  ],
});

router.afterEach((route) => {
  applyRouteDocumentMetadata(document, route);
});

export default router;
