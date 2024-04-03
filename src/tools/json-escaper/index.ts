import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Json Escaper/Unescaper',
  path: '/json-escaper',
  description: 'Escape and unescape JSON string',
  keywords: ['json', 'string', 'escape', 'unescape'],
  component: () => import('./json-escaper.vue'),
  icon: Braces,
  createdAt: new Date('2024-03-09'),
});
