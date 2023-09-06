import { Qrcode } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'WiFi QR Code generator',
  path: '/wifi-qrcode-generator',
  description:
    'Generate and download QR-codes for quick connections to WiFi networks.',
  keywords: ['qr', 'code', 'generator', 'square', 'color', 'link', 'low', 'medium', 'quartile', 'high', 'transparent', 'wifi'],
  component: () => import('./wifi-qr-code-generator.vue'),
  icon: Qrcode,
  createdAt: new Date('2023-09-06'),
});
