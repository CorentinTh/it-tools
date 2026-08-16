import { Hash } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Crypto',
  order: 6,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.file-hash.title'),
  path: '/file-hash',
  description: translate('tools.file-hash.description'),
  keywords: [
    'file',
    'hash',
    'checksum',
    'digest',
    'SHA-1',
    'SHA-256',
    'SHA-384',
    'SHA-512',
    'SHA3-256',
    'BLAKE3',
    'MD5',
    'integrity',
  ],
  component: () => import('./file-hash.vue'),
  icon: Hash,
});
