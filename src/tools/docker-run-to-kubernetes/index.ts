import { BrandDocker } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Docker run to kubernetes',
  path: '/docker-run-to-kubernetes',
  description: 'Docker run command(s) to Kubernetes manifests',
  keywords: ['docker', 'run', 'convert', 'kubernetes'],
  component: () => import('./docker-run-to-kubernetes.vue'),
  icon: BrandDocker,
  createdAt: new Date('2024-02-18'),
});
