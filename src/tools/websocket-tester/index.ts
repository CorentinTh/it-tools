import { Sock } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Websocket tester',
  path: '/websocket-tester',
  description: 'Allows to test WebSocket connections',
  keywords: ['websocket', 'ws', 'tester'],
  component: () => import('./websocket-tester.vue'),
  icon: Sock,
  createdAt: new Date('2024-08-15'),
});
