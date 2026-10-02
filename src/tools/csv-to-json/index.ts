import { FileCode } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'CSV to JSON',
  path: '/csv-to-json',
  description: 'Convert CSV to JSON with RFC 4180 quoted fields, custom delimiters, optional headers and type inference',
  keywords: ['csv', 'json', 'converter', 'rfc4180', 'delimiter', 'tsv'],
  component: () => import('./csv-to-json.vue'),
  icon: FileCode,
  createdAt: new Date('2026-10-01'),
});
