import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Passphrase Generator',
  path: '/passphrase-generator',
  description: 'Generate random memoizable Passphrases',
  keywords: ['passphrase', 'random', 'password', 'generator'],
  component: () => import('./passphrase-generator.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2024-08-15'),
});
