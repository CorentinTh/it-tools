import { Certificate } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.rsa-key-pair-generator.title'),
  path: '/rsa-key-pair-generator',
  description: 'Generate new random RSA private and public keys (with or without passphrase).',
  keywords: ['rsa', 'key', 'pair', 'generator', 'public', 'private', 'secret', 'ssh', 'pem', 'passphrase', 'password'],
  component: () => import('./rsa-key-pair-generator.vue'),
  icon: Certificate,
});
