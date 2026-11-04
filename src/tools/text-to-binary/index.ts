import { Binary } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.text-to-binary.title'),
  path: '/text-to-binary',
  description: translate('tools.text-to-binary.description'),
  keywords: ['text', 'to', 'binary', 'converter', 'encode', 'decode', 'ascii'],
  component: () => import('./text-to-binary.vue'),
  icon: Binary,
  createdAt: new Date('2023-10-15'),
});
