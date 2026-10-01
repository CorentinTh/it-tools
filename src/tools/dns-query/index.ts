import { Server } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'DNS query',
  path: '/dns-query',
  description: 'Look up DNS records (A, AAAA, MX, TXT, NS...) through DNS-over-HTTPS via Cloudflare or Google',
  keywords: ['dns', 'query', 'lookup', 'doh', 'record', 'a', 'aaaa', 'mx', 'txt', 'ns'],
  component: () => import('./dns-query.vue'),
  icon: Server,
  createdAt: new Date('2026-10-01'),
});
