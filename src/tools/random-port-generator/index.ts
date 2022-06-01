import { Server } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Random port generator',
  path: '/random-port-generator',
  description: 'Generate random port numbers outside of the range of "known" ports (0-1023).',
  keywords: ['system', 'port', 'lan', 'generator', 'random', 'development', 'computer'],
  component: () => import('./random-port-generator.vue'),
  icon: Server,
});
