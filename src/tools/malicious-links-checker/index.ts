import { ShieldCheck } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Malicious Links Checker',
  path: '/malicious-links-checker',
  description: 'Check an url against Google Safe Browsing service',
  keywords: ['malicious', 'links', 'checker', 'check', 'safe', 'safe-browsing', 'google'],
  component: () => import('./malicious-links-checker.vue'),
  icon: ShieldCheck,
  createdAt: new Date('2024-05-11'),
});
