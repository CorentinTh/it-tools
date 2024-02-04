import { FileText } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '文本字符统计',
  path: '/text-statistics',
  description: '获取有关文本、字符数、行数、字节大小等的信息',
  keywords: ['文本', '统计', '长度', '字符数', '行数', '大小', '字节'],
  component: () => import('./text-statistics.vue'),
  icon: FileText,
  redirectFrom: ['/text-stats'],
});
