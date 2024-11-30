import { World } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'DNS Queries',
  path: '/dns-queries',
  description: 'Perform DNS Queries (over HTTPS)',
  keywords: ['dns', 'nslookup', 'queries'],
  component: () => import('./dns-queries.vue'),
  icon: World,
  createdAt: new Date('2024-08-15'),
});
