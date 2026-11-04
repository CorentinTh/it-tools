import { FileDigit } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.base64-file-converter.title'),
  path: '/base64-file-converter',
  description: translate('tools.base64-file-converter.description'),
  keywords: ['base64', 'converter', 'upload', 'image', 'file', 'conversion', 'web', 'data', 'format'],
  component: () => import('./base64-file-converter.vue'),
  icon: FileDigit,
});
