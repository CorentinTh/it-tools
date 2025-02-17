import { Qrcode } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.qr-contact-info-generator.title'),
  path: '/qr-contact-info-generator',
  description: translate('tools.qr-contact-info-generator.description'),
  keywords: ['qr', 'contact', 'info', 'generator'],
  component: () => import('./qr-contact-info-generator.vue'),
  icon: Qrcode,
  createdAt: new Date('2025-02-17'),
});