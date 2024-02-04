import { UnfoldMoreOutlined } from '@vicons/material';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'IPv4范围扩展器',
  path: '/ipv4-range-expander',
  description:
    '给定起始和结束 IPv4 地址，该工具使用 CIDR 表示法计算并扩展有效的 IPv4 网络。',
  keywords: ['ipv4', '范围', '扩展器', '子网', '创建器', 'cidr'],
  component: () => import('./ipv4-range-expander.vue'),
  icon: UnfoldMoreOutlined,
  createdAt: new Date('2023-04-19'),
});
