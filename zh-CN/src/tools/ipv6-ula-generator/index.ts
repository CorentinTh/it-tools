import { BuildingFactory } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'IPv6 ULA 生成器',
  path: '/ipv6-ula-generator',
  description: '根据 RFC4193标准 在网络上生成您自己的本地、不可路由的 IP 地址。',
  keywords: ['ipv6', 'ula', '生成', 'rfc4193', '网络', '私有'],
  component: () => import('./ipv6-ula-generator.vue'),
  icon: BuildingFactory,
  createdAt: new Date('2023-04-09'),
});
