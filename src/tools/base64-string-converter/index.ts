import { IconFileDigit } from '@tabler/icons-vue';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.base64-string-converter.title'),
  path: '/base64-string-converter',
  description: translate('tools.base64-string-converter.description'),
  keywords: ['base64', 'converter', 'conversion', 'web', 'data', 'format', 'atob', 'btoa'],
  component: () => import('./base64-string-converter.vue'),
  icon: IconFileDigit,
  redirectFrom: ['/file-to-base64', '/base64-converter'],
});
