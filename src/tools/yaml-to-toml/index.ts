import { AlignJustified } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'YAML to TOML',
  path: '/yaml-to-toml',
  description: 'Parse and convert YAML to TOML.',
  keywords: ['yaml', 'to', 'toml', 'convert', 'transform'],
  component: () => import('./yaml-to-toml.vue'),
  icon: AlignJustified,
  createdAt: new Date('2023-06-23'),
});
