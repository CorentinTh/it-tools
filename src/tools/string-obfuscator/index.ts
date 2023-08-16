import { EyeOff } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'String obfuscator',
  path: '/string-obfuscator',
  description: 'Obfuscate a string (like a secret, an IBAN, or a token) to make it shareable and identifiable without revealing its content.',
  keywords: ['string', 'obfuscator', 'secret', 'token', 'hide', 'obscure', 'mask', 'masking'],
  component: () => import('./string-obfuscator.vue'),
  icon: EyeOff,
  createdAt: new Date('2023-08-16'),
});
