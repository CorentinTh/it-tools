import { TimerOutlined } from '@vicons/material';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '秒表',
  path: '/chronometer',
  description: '这是一个简单的秒表。用于监控事物的持续时间。',
  keywords: ['chronometer', 'time', 'lap', 'duration', 'measure', 'pause', 'resume', 'stopwatch'],
  component: () => import('./chronometer.vue'),
  icon: TimerOutlined,
});
