import { AlignJustified } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'YAML 转 JSON',
  path: '/yaml-to-json-converter',
  description: '解析 YAML 并转换为 JSON',
  keywords: ['yaml', '转', '转换', 'json'],
  component: () => import('./yaml-to-json.vue'),
  icon: AlignJustified,
  createdAt: new Date('2023-04-10'),
});
