import { World } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'API Tester',
  path: '/api-tester',
  description: 'HTTP API Tester',
  keywords: ['api', 'http', 'call', 'tester'],
  component: () => import('./api-tester.vue'),
  icon: World,
  createdAt: new Date('2024-05-11'),
});
