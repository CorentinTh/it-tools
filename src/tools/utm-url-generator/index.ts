import { Ad } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'UTM Url Generator',
  path: '/utm-url-generator',
  description: 'Generate an URL with utm_ parameters',
  keywords: ['utm', 'url', 'generator'],
  component: () => import('./utm-url-generator.vue'),
  icon: Ad,
  createdAt: new Date('2024-03-15'),
});
