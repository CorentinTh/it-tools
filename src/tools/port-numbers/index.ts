import { PlugConnected } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Port Numbers',
  path: '/port-numbers',
  description: 'Search for assigned usage of a given port and protocol',
  keywords: ['port', 'tcp', 'udp', 'protocol'],
  component: () => import('./port-numbers.vue'),
  icon: PlugConnected,
  createdAt: new Date('2024-04-20'),
});
