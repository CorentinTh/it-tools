import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'CSR Generator',
  path: '/csr-generator',
  description: 'Certificate Signing Request generator (PEM format)',
  keywords: ['csr', 'certificate', 'signing', 'request', 'x509', 'generator'],
  component: () => import('./csr-generator.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2024-02-25'),
});
