import { FileCertificate } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.ssl-certificate-parser.title'),
  path: '/ssl-certificate-parser',
  description: translate('tools.ssl-certificate-parser.description'),
  keywords: ['ssl', 'certificate', 'x509', 'pem', 'cert', 'tls', 'https', 'expiry', 'issuer', 'subject', 'domain'],
  component: () => import('./ssl-certificate-parser.vue'),
  icon: FileCertificate,
  createdAt: new Date('2026-06-05'),
});
