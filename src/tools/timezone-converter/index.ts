import { World } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Timezone converter',
  path: '/timezone-converter',
  description: 'Convert a date and time between IANA timezones, honoring DST rules',
  keywords: ['timezone', 'time', 'zone', 'converter', 'dst', 'utc', 'gmt', 'iana'],
  component: () => import('./timezone-converter.vue'),
  icon: World,
  createdAt: new Date('2026-10-01'),
});
