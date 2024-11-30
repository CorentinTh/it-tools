import { SquaresDiagonal } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Area Units Converter',
  path: '/area-converter',
  description: 'Convert values between area units',
  keywords: ['area', 'converter'],
  component: () => import('./area-converter.vue'),
  icon: SquaresDiagonal,
  createdAt: new Date('2024-08-15'),
});
