import { Gauge } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Volume Units Converter',
  path: '/volume-converter',
  description: 'Convert values from volume units',
  keywords: ['volume', 'converter'],
  component: () => import('./volume-converter.vue'),
  icon: Gauge,
  createdAt: new Date('2024-08-15'),
});
