import { GridOnOutlined } from '@vicons/material';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Data',
  order: 1,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.xlsx-reader.title'),
  path: '/xlsx-reader',
  description: translate('tools.xlsx-reader.description'),
  keywords: ['xlsx', 'excel', 'spreadsheet', 'workbook', 'worksheet', 'table', 'csv', 'json'],
  component: () => import('./xlsx-reader.vue'),
  icon: GridOnOutlined,
});
