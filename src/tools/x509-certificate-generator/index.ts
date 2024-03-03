import { FileCertificate } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'X509 certificate generator',
  path: '/x509-certificate-generator',
  description: 'Generate a self signed SSL/x509 certificate',
  keywords: ['x509', 'ssl', 'tls', 'self-signed', 'certificate', 'generator'],
  component: () => import('./x509-certificate-generator.vue'),
  icon: FileCertificate,
  createdAt: new Date('2024-02-25'),
});
