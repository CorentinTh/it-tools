import { Coin } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Coin Flipper',
  path: '/coin-flipper',
  description: 'Flip a coin',
  keywords: ['coin', 'flipper'],
  component: () => import('./coin-flipper.vue'),
  icon: Coin,
  createdAt: new Date('2025-02-09'),
});
