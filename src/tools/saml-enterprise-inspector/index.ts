import { Fingerprint } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.saml-enterprise-inspector.title'),
  path: '/saml-enterprise-inspector',
  description: translate('tools.saml-enterprise-inspector.description'),
  keywords: ['saml', 'assertion', 'base64', 'deflate', 'redirect', 'filetime', 'ldap', 'generalized time', 'active directory'],
  component: () => import('./saml-enterprise-inspector.vue'),
  icon: Fingerprint,
});
