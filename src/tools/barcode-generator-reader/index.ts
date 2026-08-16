import { Qrcode } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Images and videos',
  order: 3,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.barcode-generator-reader.title'),
  path: '/barcode-generator-reader',
  description: translate('tools.barcode-generator-reader.description'),
  keywords: ['barcode', 'code 128', 'ean-13', 'upc-a', 'scanner', 'reader', 'generator', 'image'],
  component: () => import('./barcode-generator-reader.vue'),
  icon: Qrcode,
});
