import { IconBinary } from '@tabler/icons-vue';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.text-to-binary.title'),
  path: '/text-to-binary',
  description: translate('tools.text-to-binary.description'),
  keywords: ['text', 'to', 'binary', 'converter', 'encode', 'decode', 'ascii'],
  component: () => import('./text-to-binary.vue'),
  icon: IconBinary,
  createdAt: new Date('2023-10-15'),
});
