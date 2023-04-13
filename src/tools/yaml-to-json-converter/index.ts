import { AlignJustified } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'YAML to JSON converter',
  path: '/yaml-to-json-converter',
  description: 'Simply convert YAML to JSON with this live online converter.',
  keywords: ['yaml', 'to', 'json'],
  component: () => import('./yaml-to-json.vue'),
  icon: AlignJustified,
  createdAt: new Date('2023-04-10'),
});
