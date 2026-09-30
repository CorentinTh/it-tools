import { Bolt } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Resistor color code calculator',
  path: '/resistor-calculator',
  description: 'Decode 4-band and 5-band resistor color codes into resistance and tolerance',
  keywords: ['resistor', 'color', 'code', 'band', 'ohm', 'electronics', 'decoder'],
  component: () => import('./resistor-calculator.vue'),
  icon: Bolt,
  createdAt: new Date('2026-10-01'),
});
