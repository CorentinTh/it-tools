import { Ruler } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.length-converter.title'),
  path: '/length-converter',
  description: translate('tools.length-converter.description'),
  keywords: [
    'length',
    'distance',
    'converter',
    'meter',
    'metre',
    'kilometre',
    'kilometer',
    'millimeter',
    'millimetre',
    'centimeter',
    'centimetre',
    'inch',
    'foot',
    'feet',
    'yard',
    'mile',
  ],
  component: () => import('./length-converter.vue'),
  icon: Ruler,
});
