import { Qrcode } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'QR Code decoder',
  path: '/qr-code-decoder',
  description: 'QR Code Reader',
  keywords: ['qrcode', 'qr-code', 'decoder', 'reader'],
  component: () => import('./qr-code-decoder.vue'),
  icon: Qrcode,
  createdAt: new Date('2024-09-01'),
});
