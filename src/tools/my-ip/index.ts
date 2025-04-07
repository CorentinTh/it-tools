import { World } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'My IP Address',
  path: '/my-ip',
  description: 'Get your client IP Address (IPv4/6) using https://www.ipify.org/',
  keywords: ['my', 'client', 'ip'],
  component: () => import('./my-ip.vue'),
  icon: World,
  createdAt: new Date('2025-01-01'),
});
