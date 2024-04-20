import { renderToString } from '@vue/server-renderer';
import { setup } from '@css-render/vue3-ssr';
import { createApp } from './main';
// import 'virtual:uno.css';

/**
 * Render page with naive ui
 */
export async function render() {
  const { app, router, pinia, i18n } = createApp();
  const { collect } = setup(app);
  const appHtml = await renderToString(app);
  const cssHtml = collect();
  return {
    cssHtml,
    appHtml,
    app,
    router,
    pinia,
    i18n,
  };
}
