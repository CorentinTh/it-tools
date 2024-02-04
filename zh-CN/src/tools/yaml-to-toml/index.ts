import { AlignJustified } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'YAML 转 TOML',
  path: '/yaml-to-toml',
  description: '解析 YAML 并转换为 TOML',
  keywords: ['yaml', '转', '转换', 'toml'],
  component: () => import('./yaml-to-toml.vue'),
  icon: AlignJustified,
  createdAt: new Date('2023-06-23'),
});
