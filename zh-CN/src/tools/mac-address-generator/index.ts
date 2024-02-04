import { Devices } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'MAC地址生成器',
  path: '/mac-address-generator',
  description: '指定数量和前缀生成MAC地址',
  keywords: ['mac', '地址', '生成', '随机', '前缀'],
  component: () => import('./mac-address-generator.vue'),
  icon: Devices,
  createdAt: new Date('2023-11-31'),
});
