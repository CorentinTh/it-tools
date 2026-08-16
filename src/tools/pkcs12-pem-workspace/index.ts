import { FileCertificate } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Crypto',
  order: 19,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.pkcs12-pem-workspace.title'),
  path: '/pkcs12-pem-workspace',
  description: translate('tools.pkcs12-pem-workspace.description'),
  keywords: ['PKCS12', 'PKCS#12', 'PFX', 'P12', 'PEM', 'certificate', 'public key', 'CSR', 'X509', 'inspect', 'convert'],
  component: () => import('./pkcs12-pem-workspace.vue'),
  icon: FileCertificate,
});
