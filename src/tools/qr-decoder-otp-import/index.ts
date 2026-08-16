import { Scan } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Images and videos',
  order: 1,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.qr-decoder-otp-import.title'),
  path: '/qr-decoder-otp-import',
  description: translate('tools.qr-decoder-otp-import.description'),
  keywords: ['qr', 'decoder', 'reader', 'camera', 'otp', 'totp', 'hotp', 'otpauth'],
  component: () => import('./qr-decoder-otp-import.vue'),
  icon: Scan,
});
