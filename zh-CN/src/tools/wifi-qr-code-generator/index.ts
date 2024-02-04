import { Qrcode } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'WiFi 二维码生成器',
  path: '/wifi-qrcode-generator',
  description: '生成用于快速连接到WiFi网络的二维码',
  keywords: ['qr', 'code', '二维码', '生成器', '连接', 'wifi', '无线网'],
  component: () => import('./wifi-qr-code-generator.vue'),
  icon: Qrcode,
  createdAt: new Date('2023-09-06'),
});
