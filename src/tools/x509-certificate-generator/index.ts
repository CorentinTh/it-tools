import { Certificate } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.x509-certificate-generator.title'),
  path: '/x509-certificate-generator',
  description: translate('tools.x509-certificate-generator.description'),
  keywords: ['x509', 'certificate', 'ssl', 'tls', 'pem', 'generator', 'root', 'ca', 'self-signed'],
  component: () => import('./x509-certificate-generator.vue'),
  icon: Certificate,
});
