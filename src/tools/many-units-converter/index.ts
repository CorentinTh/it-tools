import { Calculator } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Many Units Converter',
  path: '/many-units-converter',
  description: 'Convert all kind of units',
  keywords: [
    'units',
    'uom',
    'metric',
    'imperial',
    'measurement',
    'mass',
    'weight',
    'angle',
    'area',
    'data',
    'energy',
    'force',
    'length',
    'mass',
    'power',
    'pressure',
    'temperature',
    'time',
    'volume',
    'converter'],
  component: () => import('./many-units-converter.vue'),
  icon: Calculator,
  createdAt: new Date('2024-08-15'),
});
