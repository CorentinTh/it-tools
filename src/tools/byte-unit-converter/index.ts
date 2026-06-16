import { Binary } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.byte-unit-converter.title'),
  path: '/byte-unit-converter',
  description: translate('tools.byte-unit-converter.description'),
  keywords: ['byte', 'data', 'unit', 'converter', 'KB', 'MB', 'GB', 'TB', 'PB', 'kibibyte', 'mebibyte', 'gibibyte', 'size'],
  component: () => import('./byte-unit-converter.vue'),
  icon: Binary,
  createdAt: new Date('2026-06-04'),
});
