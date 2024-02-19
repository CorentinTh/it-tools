import { Qrcode } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.wifi-qrcode-generator.title'),
  path: '/wifi-qrcode-generator',
  description: t('tools.wifi-qrcode-generator.description'),
  keywords: ['qr', 'code', 'generator', 'square', 'color', 'link', 'low', 'medium', 'quartile', 'high', 'transparent', 'wifi'],
  component: () => import('./wifi-qr-code-generator.vue'),
  icon: Qrcode,
  createdAt: new Date('2023-09-06'),
});
