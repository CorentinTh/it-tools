import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JSON 转 YAML',
  path: '/json-to-yaml-converter',
  description: '只需使用此实时在线转换器即可将 JSON 转换为 YAML。',
  keywords: ['yaml', 'to', 'json'],
  component: () => import('./json-to-yaml.vue'),
  icon: Braces,
  createdAt: new Date('2023-04-10'),
});
