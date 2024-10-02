import { Atom } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Mass Units Converter',
  path: '/mass-converter',
  description: 'Convert values between mass units',
  keywords: ['mass', 'converter'],
  component: () => import('./mass-converter.vue'),
  icon: Atom,
  createdAt: new Date('2024-08-15'),
});
