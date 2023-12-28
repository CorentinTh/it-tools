import { AlignJustified } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Properties to YAML',
  path: '/properties-to-yaml',
  description: '',
  keywords: ['properties', 'yaml', 'convert', 'spring', 'spring-boot', 'parse'],
  component: () => import('./properties-to-yaml.vue'),
  icon: AlignJustified,
  createdAt: new Date('2023-12-24'),
});
