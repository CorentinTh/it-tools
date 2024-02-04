import { Hourglass } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '任务用时计算',
  path: '/eta-calculator',
  description:
    '任务用时计算，用于计算任务的大致结束时间，例如下载结束的时刻。',
  keywords: ['预计到达时间', '计算', '预计', '时间', '到达', '平均'],
  component: () => import('./eta-calculator.vue'),
  icon: Hourglass,
});
