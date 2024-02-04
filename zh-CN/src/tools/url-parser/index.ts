import { Unlink } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'URL 解析',
  path: '/url-parser',
  description: '解析URL字符串以获取所有不同部分（协议、域名、路径、参数）',
  keywords: ['url', '解析', '协议', '域名', '路径', '参数', '链接'],
  component: () => import('./url-parser.vue'),
  icon: Unlink,
});
