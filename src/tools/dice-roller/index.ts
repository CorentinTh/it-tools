import { Dice } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Dice Roller',
  path: '/dice-roller',
  description: 'RPG Dice Roller using Dice Notation',
  keywords: ['dice', 'rng', 'rpg', 'roller'],
  component: () => import('./dice-roller.vue'),
  icon: Dice,
  createdAt: new Date('2025-02-09'),
});
