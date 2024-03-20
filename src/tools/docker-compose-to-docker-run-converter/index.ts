import { BrandDocker } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Docker Compose to Docker run converter',
  path: '/docker-compose-to-docker-run-converter',
  description: 'Turns Docker Compose filt to docker run command(s)!',
  keywords: ['docker', 'run', 'compose', 'yaml', 'yml', 'convert', 'deamon'],
  component: () => import('./docker-compose-to-docker-run-converter.vue'),
  icon: BrandDocker,
  createdAt: new Date('2024-01-03'),
});
