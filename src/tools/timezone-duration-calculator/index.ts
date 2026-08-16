import { Calendar } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Measurement',
  order: 1,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.timezone-duration-calculator.title'),
  path: '/timezone-duration-calculator',
  description: translate('tools.timezone-duration-calculator.description'),
  keywords: ['timezone', 'time zone', 'date', 'duration', 'dst', 'utc', 'convert', 'elapsed'],
  component: () => import('./timezone-duration-calculator.vue'),
  icon: Calendar,
});
