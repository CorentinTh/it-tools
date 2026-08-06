import { Hash } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.file-hash.title'),
  path: '/file-hash',
  description: translate('tools.file-hash.description'),
  keywords: ['file', 'hash', 'checksum', 'digest', 'SHA-256', 'SHA-384', 'SHA-512', 'integrity'],
  component: () => import('./file-hash.vue'),
  icon: Hash,
});
