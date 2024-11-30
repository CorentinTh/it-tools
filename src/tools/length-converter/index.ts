import { SquareHalf } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Length Units Converter',
  path: '/length-converter',
  description: 'Convert values from length units',
  keywords: ['length', 'converter'],
  component: () => import('./length-converter.vue'),
  icon: SquareHalf,
  createdAt: new Date('2024-08-15'),
});
