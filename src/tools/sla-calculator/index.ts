import { Clock } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'SLA calculator',
  path: '/sla-calculator',
  description: 'Service Level Agreement Calcultator',
  keywords: ['sla', 'service', 'level', 'agreement', 'calculator'],
  component: () => import('./sla-calculator.vue'),
  icon: Clock,
  createdAt: new Date('2024-05-11'),
});
