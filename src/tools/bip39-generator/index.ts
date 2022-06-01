import { AlignJustified } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'BIP39 passphrase generator',
  path: '/bip39-generator',
  description: 'Generate BIP39 passphrase from existing or random mnemonic, or get the mnemonic from the passphrase.',
  keywords: ['BIP39', 'passphrase', 'generator', 'mnemonic', 'entropy'],
  component: () => import('./bip39-generator.vue'),
  icon: AlignJustified,
});
