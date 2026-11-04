import { ArrowsLeftRight } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.base-converter.title'),
  path: '/base-converter',
  description: translate('tools.base-converter.description'),
  keywords: ['integer', 'number', 'base', 'conversion', 'decimal', 'hexadecimal', 'binary', 'octal', 'base64'],
  component: () => import('./integer-base-converter.vue'),
  icon: ArrowsLeftRight,
});
