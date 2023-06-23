import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JSON to TOML',
  path: '/json-to-toml',
  description: 'Parse and convert JSON to TOML.',
  keywords: ['json', 'parse', 'toml', 'convert', 'transform'],
  component: () => import('./json-to-toml.vue'),
  icon: Braces,
  createdAt: new Date('2023-06-23'),
});
