import { SpeedFilled } from '@vicons/material';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '基准构建',
  path: '/benchmark-builder',
  description: '使用这个非常简单的在线基准构建可以轻松比较任务的执行时间',
  keywords: ['benchmark', 'builder', 'execution', 'duration', 'mean', 'variance'],
  component: () => import('./benchmark-builder.vue'),
  icon: SpeedFilled,
  createdAt: new Date('2023-04-05'),
});
