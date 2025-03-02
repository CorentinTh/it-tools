import { Brightness2 } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Illuminance Converter',
  path: '/illuminance-converter',
  description: 'Illuminance units converter (Lux, Foot Candles, Nox, Phot, Flame)',
  keywords: ['illuminance', 'converter', 'lux', 'lx', 'foot', 'candles', 'fc', 'flame', 'nox', 'phot'],
  component: () => import('./illuminance-converter.vue'),
  icon: Brightness2,
  createdAt: new Date('2025-02-09'),
});
