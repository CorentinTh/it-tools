import { BrandDocker } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Composerize',
  path: '/docker-to-docker-compose',
  description: 'Turns docker run commands into docker-compose files!',
  keywords: ['docker', 'to', 'docker', 'compose'],
  component: () => import('./docker-to-docker-compose.vue'),
  icon: BrandDocker,
});
