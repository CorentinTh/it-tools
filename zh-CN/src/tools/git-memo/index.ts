import { BrandGit } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Git 速查表',
  path: '/git-memo',
  description:
    'Git 是一个去中心化的版本管理软件。 通过这个速查表，您将可以快速访问最常见的 git 命令。',
  keywords: ['git', 'push', 'force', 'pull', 'commit', 'amend', 'rebase', 'merge', 'reset', 'soft', 'hard', 'lease'],
  component: () => import('./git-memo.vue'),
  icon: BrandGit,
});
