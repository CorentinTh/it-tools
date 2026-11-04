import { SortDescendingNumbers } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.ulid-generator.title'),
  path: '/ulid-generator',
  description: translate('tools.ulid-generator.description'),
  keywords: ['ulid', 'generator', 'random', 'id', 'alphanumeric', 'identity', 'token', 'string', 'identifier', 'unique'],
  component: () => import('./ulid-generator.vue'),
  icon: SortDescendingNumbers,
  createdAt: new Date('2023-09-11'),
});
