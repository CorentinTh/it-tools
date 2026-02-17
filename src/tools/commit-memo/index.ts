import { GitCommit } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.commit-memo.title'),
  path: '/commit-memo',
  description: translate('tools.commit-memo.description'),
  keywords: ['commit', 'conventional', 'git', 'changelog', 'semantic', 'commitizen', 'commitlint'],
  component: () => import('./commit-memo.vue'),
  icon: GitCommit,
  createdAt: new Date('2025-08-07'),
});
