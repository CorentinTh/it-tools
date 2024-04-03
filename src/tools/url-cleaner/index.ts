import { ClearAll } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Url Cleaner',
  path: '/url-cleaner',
  description: 'Clean Ads tracker, UTM, Facebook and other ads provider parameters from an URL',
  keywords: ['url', 'cleaner', 'utm', 'fbclip'],
  component: () => import('./url-cleaner.vue'),
  icon: ClearAll,
  createdAt: new Date('2024-03-13'),
});
