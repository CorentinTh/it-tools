import { ImageOutlined } from '@vicons/material';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Images and videos',
  order: 4,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.image-metadata-remover.title'),
  path: '/image-metadata-remover',
  description: translate('tools.image-metadata-remover.description'),
  keywords: ['image', 'exif', 'metadata', 'xmp', 'iptc', 'privacy', 'jpeg', 'png', 'webp'],
  component: () => import('./image-metadata-remover.vue'),
  icon: ImageOutlined,
});
