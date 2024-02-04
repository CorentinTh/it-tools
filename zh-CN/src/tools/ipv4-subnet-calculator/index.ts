import { RouterOutlined } from '@vicons/material';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'IPv4子网计算器',
  path: '/ipv4-subnet-calculator',
  description: '解析 IPv4 CIDR 块并获取有关子网的所有信息。',
  keywords: ['ipv4', '子网', '计算器', '掩码', '网络', 'cidr', '网络掩码', '位掩码', '广播', '地址'],
  component: () => import('./ipv4-subnet-calculator.vue'),
  icon: RouterOutlined,
});
