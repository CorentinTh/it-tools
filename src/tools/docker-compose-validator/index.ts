import { BrandDocker } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Docker Compose Validator',
  path: '/docker-compose-validator',
  description: 'Validate Docker Compose files against CommonSpec schema',
  keywords: ['docker', 'compose', 'validator', 'commonspec'],
  component: () => import('./docker-compose-validator.vue'),
  icon: BrandDocker,
  createdAt: new Date('2024-01-25'),
});
