import { TableChartOutlined } from '@vicons/material';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Data',
  order: 0,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.parquet-reader.title'),
  path: '/parquet-reader',
  description: translate('tools.parquet-reader.description'),
  keywords: ['parquet', 'apache parquet', 'columnar', 'data', 'schema', 'metadata', 'csv', 'json'],
  component: () => import('./parquet-reader.vue'),
  icon: TableChartOutlined,
});
