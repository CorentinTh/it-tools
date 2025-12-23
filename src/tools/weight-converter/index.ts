import { Scale } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.weight-converter.title'),
  path: '/weight-converter',
  description: translate('tools.weight-converter.description'),
  keywords: [
    'weight',
    'converter',
    'mass',
    'kilogram',
    'gram',
    'pound',
    'ounce',
    'stone',
  ],
  component: () => import('./weight-converter.vue'),
  icon: Scale,
});
