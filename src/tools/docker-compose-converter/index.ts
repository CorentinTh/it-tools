import { BrandDocker } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Docker Compose Format Converter',
  path: '/docker-compose-converter',
  description: 'Convert Docker Compose file between V1, 2.x, 3.x or CommonSpec and may expand ports/volumes syntaxes',
  keywords: ['docker', 'compose', 'converter'],
  component: () => import('./docker-compose-converter.vue'),
  icon: BrandDocker,
  createdAt: new Date('2024-01-04'),
});
