import { Qrcode } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '二维码生成器',
  path: '/qrcode-generator',
  description: '生成并下载URL或文本的QR码',
  keywords: ['qr', 'code', 'generator', 'square', 'color', 'link', 'low', 'medium', 'quartile', 'high', 'transparent'],
  component: () => import('./qr-code-generator.vue'),
  icon: Qrcode,
});
