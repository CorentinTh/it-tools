import { Link } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.http-request-code-builder.title'),
  path: '/http-request-code-builder',
  description: translate('tools.http-request-code-builder.description'),
  keywords: ['http', 'request', 'curl', 'fetch', 'api', 'headers', 'query', 'code', 'redact'],
  component: () => import('./http-request-code-builder.vue'),
  icon: Link,
});
