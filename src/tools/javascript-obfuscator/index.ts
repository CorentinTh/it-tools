import { Lock } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JavaScript Obfuscator',
  path: '/javascript-obfuscator',
  description: 'Javascript code obfuscator using base64 or rot13 encoding by Forza for IT Tools',
  keywords: ['javascript', 'obfuscator'],
  component: () => import('./javascript-obfuscator.vue'),
  icon: Lock,
  createdAt: new Date('2025-12-31'),
});
