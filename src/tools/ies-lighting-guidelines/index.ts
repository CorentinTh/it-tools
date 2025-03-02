import { BuildingLighthouse } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'IES Lighting Guidelines',
  path: '/ies-lighting-guidelines',
  description: 'Search in the Illuminating Engineering Society’s (IES) current illuminance recommendations.',
  keywords: ['ies', 'illuminance', 'lighting', 'guideline'],
  component: () => import('./ies-lighting-guidelines.vue'),
  icon: BuildingLighthouse,
  createdAt: new Date('2025-02-09'),
});
