import { ArrowsShuffle, ShieldCheck, ShieldLock } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'SIP Authorization',
  path: '/sip-auth',
  description: 'This tool helps you to verify the SIP authorization header. The tool performs all calculations in the browser and does not transmit sensitive information over the network, so feel free to use it.',
  keywords: ['sip', 'authorization'],
  component: () => import('./sip-auth.vue'),
  icon: ShieldCheck,
  createdAt: new Date('2024-04-11'),
});
