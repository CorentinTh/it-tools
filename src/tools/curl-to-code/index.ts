import { Terminal } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.curl-to-code.title'),
  path: '/curl-to-code',
  description: translate('tools.curl-to-code.description'),
  keywords: ['curl', 'code', 'converter', 'python', 'javascript', 'go', 'fetch', 'requests', 'http', 'api'],
  component: () => import('./curl-to-code.vue'),
  icon: Terminal,
  createdAt: new Date('2026-06-04'),
});
