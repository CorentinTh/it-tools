import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Csr generator',
  path: '/csr-generator',
  description: '',
  keywords: ['csr', 'certificate', 'signing', 'request', 'x509', 'generator'],
  component: () => import('./csr-generator.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2024-02-22'),
});
