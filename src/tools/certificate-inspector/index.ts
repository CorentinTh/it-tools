import { Fingerprint } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Crypto',
  order: 16,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.certificate-inspector.title'),
  path: '/certificate-inspector',
  description: translate('tools.certificate-inspector.description'),
  keywords: ['certificate', 'x509', 'pem', 'der', 'csr', 'pkcs10', 'public key', 'fingerprint', 'tls'],
  component: () => import('./certificate-inspector.vue'),
  icon: Fingerprint,
});
