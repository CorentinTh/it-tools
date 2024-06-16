import { ExternalLink } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Curl generator',
  path: '/curl-generator',
  description: 'Generate curl version for common coding languages',
  keywords: ['curl', 'code', 'language', 'generator'],
  component: () => import('./curl-generator.vue'),
  icon: ExternalLink,
  createdAt: new Date('2024-04-20'),
});
