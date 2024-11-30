import { IconList } from '@tabler/icons-vue';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.list-converter.title'),
  path: '/list-converter',
  description: translate('tools.list-converter.description'),
  keywords: ['list', 'converter', 'sort', 'reverse', 'prefix', 'suffix', 'lowercase', 'truncate'],
  component: () => import('./list-converter.vue'),
  icon: IconList,
  createdAt: new Date('2023-05-07'),
});
