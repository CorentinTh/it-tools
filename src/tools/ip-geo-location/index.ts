import { World } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'IP Geo Location',
  path: '/ip-geo-location',
  description: 'Retrieve information about an IPv4/6 address or domain location',
  keywords: ['ip', 'domain', 'geo', 'location'],
  component: () => import('./ip-geo-location.vue'),
  icon: World,
  createdAt: new Date('2024-01-17'),
});
