import { Alarm } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '定时任务生成器',
  path: '/crontab-generator',
  description: '验证并生成定时任务并获取人类可读的描述。',
  keywords: [
    '定时任务',
    '生成器',
    '定时作业',
    '计划任务',
    '日程安排',
    '解析',
    '表达式',
    '年',
    '月',
    '周',
    '天',
    '分钟',
    '秒钟',
  ],
  component: () => import('./crontab-generator.vue'),
  icon: Alarm,
});
