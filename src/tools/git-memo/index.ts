import { BrandGit } from '@vicons/tabler';
import type { ITool } from '../Tool';

export const tool: ITool = {
  name: 'Git cheatsheet',
  path: '/git-memo',
  description:
    'Git is a decentralized version management software. With this cheatsheet you will have a quick access to the most common git commands.',
  keywords: ['git', 'push', 'force', 'pull', 'commit', 'amend', 'rebase', 'merge', 'reset', 'soft', 'hard', 'lease'],
  component: () => import('./git-memo.vue'),
  icon: BrandGit,
};
