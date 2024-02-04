import { List } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JSON 转 CSV',
  path: '/json-to-csv',
  description: '将 JSON格式的数组数据 转换为 CSV格式。',
  keywords: ['json', 'to', 'csv', '转换器'],
  component: () => import('./json-to-csv.vue'),
  icon: List,
  createdAt: new Date('2023-06-18'),
});
