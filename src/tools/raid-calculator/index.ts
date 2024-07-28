import { Database } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'RAID Calculator',
  path: '/raid-calculator',
  description: 'Calculate storage capacity and fault tolerance of an array based on the number of disks, size, and RAID type',
  keywords: ['raid', 'calculator'],
  component: () => import('./raid-calculator.vue'),
  icon: Database,
  createdAt: new Date('2024-07-27'),
});
