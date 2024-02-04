import { SortDescendingNumbers } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'ULID 生成器',
  path: '/ulid-generator',
  description: '生成随机的通用唯一词典可排序标识符 (ULID)',
  keywords: ['ulid', '生成', '随机', 'id', '字母', '数字', '身份', '令牌', 'token', '字符串', '标识符', '唯一'],
  component: () => import('./ulid-generator.vue'),
  icon: SortDescendingNumbers,
  createdAt: new Date('2023-09-11'),
});
