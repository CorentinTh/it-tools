import { BuildingFactory } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'IPv6 ULA generator',
  path: '/ipv6-ula-generator',
  description: `When you set up IPv6, you may need to set up your own local, non-routable IP addresses on your network - 
similar to the older RFC1918 blocks. RFC4193 addresses (no pun intended) this issue.

Your IP address block assigned should be generated randomly from the fc00::/7 block. As IETF hasn't formalized fc00::/8, 
addresses should be assigned out of fd00::/8.`,
  keywords: ['ipv6', 'ula', 'generator', 'rfc1918', 'rfc4193', 'network', 'private'],
  component: () => import('./ipv6-ula-generator.vue'),
  icon: BuildingFactory,
  createdAt: new Date('2023-04-09'),
});
