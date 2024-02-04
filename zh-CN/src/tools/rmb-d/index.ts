import { CurrencyYen } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '人民币大写转换器',
  path: '/rmb-d',
  description: '人民币大写转换工具，提供在线人民币大写转换服务',
  keywords: ['人民币', '大写', '转换'],
  component: () => import('./rmb-d.vue'),
  icon: CurrencyYen,
  createdAt: new Date('2023-12-11'),
});