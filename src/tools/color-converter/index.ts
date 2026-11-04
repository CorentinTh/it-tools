import { Palette } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.color-converter.title'),
  path: '/color-converter',
  description: translate('tools.color-converter.description'),
  keywords: ['color', 'converter'],
  component: () => import('./color-converter.vue'),
  icon: Palette,
  redirectFrom: ['/color-picker-converter'],
});
