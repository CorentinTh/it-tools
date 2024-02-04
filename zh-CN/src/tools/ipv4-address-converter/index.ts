import { Binary } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'IPv4地址转换器',
  path: '/ipv4-address-converter',
  description: '将IP地址转换为十进制、二进制、十六进制或IPv6中的事件',
  keywords: ['ipv4', '地址', '转换器', '十进制', '十六进制', '二进制', 'ipv6'],
  component: () => import('./ipv4-address-converter.vue'),
  icon: Binary,
  createdAt: new Date('2023-04-08'),
});
