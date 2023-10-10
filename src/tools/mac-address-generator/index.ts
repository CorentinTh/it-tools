import { Atom2 } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'MAC address generator',
  path: '/mac-address-generator',
  description: 'Enter the quantity and prefix. MAC addresses will be generated in your chosen case (uppercase or lowercase)',
  keywords: ['mac', 'address', 'generator'],
  component: () => import('./mac-address-generator.vue'),
  icon: Atom2,
  createdAt: new Date('2023-10-11'),
});
