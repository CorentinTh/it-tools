import { Browser } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'User-agent parser',
  path: '/user-agent-parser',
  description: 'Detect and parse Browser, Engine, OS, CPU, and Device type/model from an user-agent string.',
  keywords: ['user', 'agent', 'parser', 'browser', 'engine', 'os', 'cpu', 'device', 'user-agent', 'client'],
  component: () => import('./user-agent-parser.vue'),
  icon: Browser,
  createdAt: new Date('2023-04-06'),
});
