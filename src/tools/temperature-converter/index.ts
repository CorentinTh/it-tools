import { Temperature } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Temperature converter',
  path: '/temperature-converter',
  description:
    'Temperature degrees conversions for Kelvin, Celsius, Fahrenheit, Rankine, Delisle, Newton, Réaumur and Rømer.',
  keywords: [
    'temperature',
    'converter',
    'degree',
    'Kelvin',
    'Celsius',
    'Fahrenheit',
    'Rankine',
    'Delisle',
    'Newton',
    'Réaumur',
    'Rømer',
  ],
  component: () => import('./temperature-converter.vue'),
  icon: Temperature,
});
