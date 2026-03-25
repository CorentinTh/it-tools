import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Dns records lookup',
  path: '/dns-records-lookup',
  description: '',
  keywords: ['dns', 'records', 'lookup'],
  component: () => import('./dns-records-lookup.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2026-03-25'),
});
