import { Link } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.url-encoder.title'),
  path: '/url-encoder',
  description: translate('tools.url-encoder.description'),
  keywords: ['url', 'encode', 'decode', 'percent', '%20', 'format'],
  component: () => import('./url-encoder.vue'),
  icon: Link,
});
