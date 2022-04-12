import { BrandGit } from '@vicons/tabler';
import type { ITool } from '../Tool';

export const tool: ITool = {
  name: 'Git cheatsheet',
  path: '/git-memo',
  description: 'Git is a decentralized version management sofware. With this cheatsheet you will have a quick acces to the most common git commands.',
  keywords: ['git', 'push', 'force', 'pull', 'commit', 'ammend', 'rebase', 'merge', 'reset', 'soft', 'hard', 'lease'],
  component: () => import('./git-memo.vue'),
  icon: BrandGit,
};
