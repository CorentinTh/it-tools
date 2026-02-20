import { WorldLatitude } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Geo distance calculator',
  path: '/geo-distance-calculator',
  description: 'Compute distance between two geo location (and display current user location information)',
  keywords: ['geo', 'distance', 'calculator'],
  component: () => import('./geo-distance-calculator.vue'),
  icon: WorldLatitude,
  createdAt: new Date('2025-01-01'),
});
