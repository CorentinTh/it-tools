import { TimerOutlined } from '@vicons/material';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.chronometer.title'),
  path: '/chronometer',
  description: translate('tools.chronometer.description'),
  keywords: ['chronometer', 'time', 'lap', 'duration', 'measure', 'pause', 'resume', 'stopwatch'],
  component: () => import('./chronometer.vue'),
  icon: TimerOutlined,
});
