import { Atom } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Pressure Units Converter',
  path: '/pressure-converter',
  description: 'Convert values between pressure units',
  keywords: ['pressure', 'converter'],
  component: () => import('./pressure-converter.vue'),
  icon: Atom,
  createdAt: new Date('2024-08-15'),
});
