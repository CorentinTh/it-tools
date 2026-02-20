import { PlayCard } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Card Picker',
  path: '/card-picker',
  description: 'Generate a deck of playing cards',
  keywords: ['card', 'deck', 'picker'],
  component: () => import('./card-picker.vue'),
  icon: PlayCard,
  createdAt: new Date('2025-02-09'),
});
