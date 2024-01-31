import { AlignJustified } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'YAML prettify and format',
  path: '/yaml-prettify',
  description: 'Prettify your YAML string to a human friendly readable format.',
  keywords: ['yaml', 'viewer', 'prettify', 'format'],
  component: () => import('./yaml-viewer.vue'),
  icon: AlignJustified,
  createdAt: new Date('2024-01-31'),
});
