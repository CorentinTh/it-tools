import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Json to Schema',
  path: '/json-to-schema',
  description: 'Convert JSON data to JSON Schema, MySQL DDL, Mongoose Schema, Google BigQuery schema or ClickHouse Table Schema',
  keywords: ['json', 'schema', 'mysql', 'sql', 'ddl', 'mongoose', 'bigquery', 'clickhouse', 'table'],
  component: () => import('./json-to-schema.vue'),
  icon: Braces,
  createdAt: new Date('2024-05-11'),
});
