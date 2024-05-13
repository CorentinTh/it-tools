import { Mail } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'MIME Encoding Converter',
  path: '/mime-converter',
  description: 'Convert from/to MIME Encoded-Word format (Mail Subject)',
  keywords: ['mime', 'converter', 'subject', 'rfc2047', 'rfc1341', 'rfc2045'],
  component: () => import('./mime-converter.vue'),
  icon: Mail,
  createdAt: new Date('2024-03-09'),
});
