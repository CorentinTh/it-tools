import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JSON to Go',
  path: '/json-to-go',
  description: 'Convert JSON to Go struct',
  keywords: ['json', 'parse', 'go', 'convert', 'transform'],
  component: () => import('./json-to-go.vue'),
  icon: Braces,
  createdAt: new Date('2024-04-02'),
});
