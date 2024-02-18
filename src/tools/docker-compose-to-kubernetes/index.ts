import { BrandDocker } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Docker compose to kubernetes',
  path: '/docker-compose-to-kubernetes',
  description: 'Docker Compose to Kubernetes manifests',
  keywords: ['docker', 'compose', 'convert', 'kubernetes'],
  component: () => import('./docker-compose-to-kubernetes.vue'),
  icon: BrandDocker,
  createdAt: new Date('2024-02-18'),
});
