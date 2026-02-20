import { Disc } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'SMART Raw Converter',
  path: '/smart-raw-converter',
  description: 'Convert SMART Raw values to human readable',
  keywords: ['smart', 'raw', 'converter'],
  component: () => import('./smart-raw-converter.vue'),
  icon: Disc,
  createdAt: new Date('2024-07-14'),
});
