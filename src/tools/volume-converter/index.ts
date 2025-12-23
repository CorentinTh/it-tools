import { Flask } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.volume-converter.title'),
  path: '/volume-converter',
  description: translate('tools.volume-converter.description'),
  keywords: [
    'volume',
    'capacity',
    'converter',
    'liter',
    'litre',
    'milliliter',
    'millilitre',
    'gallon',
    'cup',
    'pint',
    'quart',
    'fluid',
    'ounce',
    'fl-oz',
    'tablespoon',
    'teaspoon',
  ],
  component: () => import('./volume-converter.vue'),
  icon: Flask,
});
