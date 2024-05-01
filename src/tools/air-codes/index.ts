import { Plane } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Air Codes',
  path: '/air-codes',
  description: 'Get Airport and Airline info from name, ICAO code or IATA code',
  keywords: ['airport', 'airline', 'air', 'plane', 'icao', 'iata'],
  component: () => import('./air-codes.vue'),
  icon: Plane,
  createdAt: new Date('2024-04-20'),
});
