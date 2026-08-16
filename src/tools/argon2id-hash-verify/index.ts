import { Fingerprint } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Crypto',
  order: 8,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.argon2id-hash-verify.title'),
  path: '/argon2id-hash-verify',
  description: translate('tools.argon2id-hash-verify.description'),
  keywords: ['argon2', 'argon2id', 'password', 'hash', 'verify', 'phc', 'wasm', 'salt', 'kdf'],
  component: () => import('./argon2id-hash-verify.vue'),
  icon: Fingerprint,
});
