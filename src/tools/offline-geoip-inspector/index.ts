import { MapSearch } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Network',
  order: 9,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.offline-geoip-inspector.title'),
  path: '/offline-geoip-inspector',
  description: translate('tools.offline-geoip-inspector.description'),
  keywords: ['GeoIP', 'IP', 'country', 'IPv4', 'IPv6', 'offline', 'local', 'PDDL'],
  component: () => import('./offline-geoip-inspector.vue'),
  icon: MapSearch,
});
