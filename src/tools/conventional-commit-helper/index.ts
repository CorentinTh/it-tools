import { BrandGit } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.conventional-commit-helper.title'),
  path: '/conventional-commit-helper',
  description: translate('tools.conventional-commit-helper.description'),
  keywords: ['conventional commits', 'git', 'commit', 'semantic release', 'changelog', 'breaking change'],
  component: () => import('./conventional-commit-helper.vue'),
  icon: BrandGit,
});
