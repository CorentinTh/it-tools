import { LockSquare } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Crypto',
  order: 20,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.local-encrypted-otp-vault.title'),
  path: '/local-encrypted-otp-vault',
  description: translate('tools.local-encrypted-otp-vault.description'),
  keywords: ['OTP', 'TOTP', 'vault', 'AES-GCM', 'PBKDF2', 'IndexedDB', 'local', 'encrypted'],
  component: () => import('./local-encrypted-otp-vault.vue'),
  icon: LockSquare,
});
