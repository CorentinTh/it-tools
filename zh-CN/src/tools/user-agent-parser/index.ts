import { Browser } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'User-agent 解析',
  path: '/user-agent-parser',
  description: '从用户代理字符串（user-agent，也称UA）中检测并解析浏览器、引擎、操作系统、CPU 和设备类型/型号。',
  keywords: ['user', 'agent', 'ua', '解析', '浏览器', '引擎', '操作系统', 'cpu', '设备', 'user-agent', '客户端'],
  component: () => import('./user-agent-parser.vue'),
  icon: Browser,
  createdAt: new Date('2023-04-06'),
});
