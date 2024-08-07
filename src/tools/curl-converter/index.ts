import { ExternalLink } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Curl Converter',
  path: '/curl-converter',
  description: 'Generate common coding languages version of provided curl command line',
  keywords: ['curl', 'code', 'language', 'generator'],
  component: () => import('./curl-converter.vue'),
  icon: ExternalLink,
  createdAt: new Date('2024-04-20'),
});
