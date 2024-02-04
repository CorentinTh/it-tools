import { Link } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'URL 编码/解码',
  path: '/url-encoder',
  description: '对URL格式的字符串进行编码/解码',
  keywords: ['url', '编码', '解码', '%20', '格式'],
  component: () => import('./url-encoder.vue'),
  icon: Link,
});
