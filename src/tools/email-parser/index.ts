import { Mail } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Email Parser',
  path: '/email-parser',
  description: 'Parse and extract information from raw Email content',
  keywords: ['email', 'parser', 'header', 'rfc2822', 'rfc5322', 'rfc822'],
  component: () => import('./email-parser.vue'),
  icon: Mail,
  createdAt: new Date('2024-08-15'),
});
