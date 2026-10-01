import { Lock } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JWT generator',
  path: '/jwt-generator',
  description: 'Generate and sign JWT tokens (HS256, HS384, HS512) with a shared secret, in your browser',
  keywords: ['jwt', 'token', 'generator', 'hmac', 'hs256', 'sign', 'json', 'web'],
  component: () => import('./jwt-generator.vue'),
  icon: Lock,
  createdAt: new Date('2026-10-01'),
});
