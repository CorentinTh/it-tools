import type { LocaleKey } from './modules/i18n/i18n.types';
import { A, Navigate, type RouteDefinition, useParams } from '@solidjs/router';
import { map } from 'lodash-es';
import { localeKeys, locales } from './modules/i18n/i18n.constants';
import { getBrowserLocale, useI18n } from './modules/i18n/i18n.provider';
import { HomePage } from './modules/pages/home.page';
import { ToolPage } from './modules/tools/pages/tool.page';
import { toolSlugs } from './modules/tools/tools.registry';
import { Button } from './modules/ui/components/button';
import { AppLayout } from './modules/ui/layouts/app.layout';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: () => {
      const { getLocale } = useI18n();

      return <Navigate href={`/${getLocale()}`} />;
    },
  },
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '/:localeKey',
        matchFilters: {
          localeKey: localeKeys,
        },
        component: (props) => {
          const params = useParams();
          const { setLocale } = useI18n();

          setLocale(params.localeKey as LocaleKey);

          return props.children;
        },
        children: [
          {
            path: '/',
            component: HomePage,
          },
          {
            path: '/:toolSlug',
            matchFilters: {
              toolSlug: toolSlugs,
            },
            component: ToolPage,
          },
        ],
      },
      {
        path: '*404',
        component: () => (
          <div class="flex flex-col items-center justify-center mt-6">
            <div class="text-3xl font-light text-muted-foreground">404</div>
            <h1 class="font-semibold text-lg my-2">Page Not Found</h1>
            <p class="text-muted-foreground">The page you are looking for does not exist.</p>
            <p class="text-muted-foreground">Please check the URL and try again.</p>
            <Button as={A} href="/" class="mt-4" variant="secondary">
              <div class="i-tabler-arrow-left mr-2"></div>
              Go back home
            </Button>
          </div>
        ),
      },
    ],
  },

];
