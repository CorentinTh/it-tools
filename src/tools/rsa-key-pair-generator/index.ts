import { Certificate } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'RSA key pair generator',
  path: '/rsa-key-pair-generator',
  description: 'Generate new random RSA private and public key pem certificates.',
  keywords: ['rsa', 'key', 'pair', 'generator', 'public', 'private', 'secret', 'ssh', 'pem'],
  component: () => import('./rsa-key-pair-generator.vue'),
  icon: Certificate,
});
