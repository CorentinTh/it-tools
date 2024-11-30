import { IconQrcode } from '@tabler/icons-vue';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.wifi-qrcode-generator.title'),
  path: '/wifi-qrcode-generator',
  description: translate('tools.wifi-qrcode-generator.description'),
  keywords: ['qr', 'code', 'generator', 'square', 'color', 'link', 'low', 'medium', 'quartile', 'high', 'transparent', 'wifi'],
  component: () => import('./wifi-qr-code-generator.vue'),
  icon: IconQrcode,
  createdAt: new Date('2023-09-06'),
});
