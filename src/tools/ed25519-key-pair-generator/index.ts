import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Ed25519 key pair generator',
  path: '/ed25519-key-pair-generator',
  description: '',
  keywords: ['ed25519', 'key', 'pair', 'generator'],
  component: () => import('./ed25519-key-pair-generator.vue'),
  icon: ArrowsShuffle,
});