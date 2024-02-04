import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JSON 转 TOML',
  path: '/json-to-toml',
  description: '解析 JSON 并将其转换为 TOML。',
  keywords: ['json', '解析', 'toml', '转换'],
  component: () => import('./json-to-toml.vue'),
  icon: Braces,
  createdAt: new Date('2023-06-23'),
});
