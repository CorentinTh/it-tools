import { Code } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.css-js-prettify-minify.title'),
  path: '/css-js-prettify-minify',
  description: translate('tools.css-js-prettify-minify.description'),
  keywords: ['css', 'javascript', 'js', 'prettify', 'minify', 'beautify', 'format', 'uglify', 'compress', 'formatter'],
  component: () => import('./css-js-prettify-minify.vue'),
  icon: Code,
  createdAt: new Date('2026-06-04'),
});
