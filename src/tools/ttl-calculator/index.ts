import { CalendarTime } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'TTL calculator',
  path: '/ttl-calculator',
  description: 'TTL to Time converter',
  keywords: ['ttl', 'dns', 'calculator', 'time', 'live', 'duration'],
  component: () => import('./ttl-calculator.vue'),
  icon: CalendarTime,
  createdAt: new Date('2024-04-20'),
});
