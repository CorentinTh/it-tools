import { Mailbox } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Bounce Email Parser',
  path: '/bounce-parser',
  description: 'Parse SMTP Bounce Emails',
  keywords: ['bounce', 'email', 'smtp', 'parser'],
  component: () => import('./bounce-parser.vue'),
  icon: Mailbox,
  createdAt: new Date('2024-08-15'),
});
