import { Alarm } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Crontab generator',
  path: '/crontab-generator',
  description: 'Validate and generate crontab and get the human readable description of the cron schedule.',
  keywords: [
    'crontab',
    'generator',
    'cronjob',
    'cron',
    'schedule',
    'parse',
    'expression',
    'year',
    'month',
    'week',
    'day',
    'minute',
    'second',
  ],
  component: () => import('./crontab-generator.vue'),
  icon: Alarm,
});
