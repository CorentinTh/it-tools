import { ShieldChevron } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'SSL Certificate converter',
  path: '/ssl-cert-converter',
  description: 'Convert SSL Certificate from different formats',
  keywords: ['ssl', 'certificate', 'crt', 'pkcs', 'p12', 'pem', 'der', 'jks', 'converter'],
  component: () => import('./ssl-cert-converter.vue'),
  icon: ShieldChevron,
  createdAt: new Date('2024-08-15'),
});
