import { Calendar } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '日期时间转换器',
  path: '/date-converter',
  description: '将日期和时间转换为各种不同的格式',
  keywords: ['日期', '时间', '转换器', 'iso', 'utc', '时区', '年', '月', '日', '分钟', '秒钟'],
  component: () => import('./date-time-converter.vue'),
  icon: Calendar,
});
