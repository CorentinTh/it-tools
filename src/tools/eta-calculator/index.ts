import { Hourglass } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'ETA calculator',
  path: '/eta-calculator',
  description:
    'An ETA (Estimated Time of Arrival) calculator to know the approximate end time of a task, for example the moment of ending of a download.',
  keywords: ['eta', 'calculator', 'estimated', 'time', 'arrival', 'average'],
  component: () => import('./eta-calculator.vue'),
  icon: Hourglass,
});
