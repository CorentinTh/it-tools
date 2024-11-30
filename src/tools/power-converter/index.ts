import { Power } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Power Converter',
  path: '/power-converter',
  description: 'Convert values between power units',
  keywords: ['power', 'converter'],
  component: () => import('./power-converter.vue'),
  icon: Power,
  createdAt: new Date('2024-08-15'),
});
