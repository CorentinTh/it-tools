import { ArrowsLeftRight } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.data-storage-unit-converter.title'),
  path: '/data-storage-unit-converter',
  description: translate('tools.data-storage-unit-converter.description'),
  keywords: ['data', 'storage', 'unit', 'conversion', 'bytes', 'KB', 'MB', 'GB', 'TB', 'PB'],
  component: () => import('./data-storage-unit-converter.vue'),
  icon: ArrowsLeftRight,
});
