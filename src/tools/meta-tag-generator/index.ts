import { Tags } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Open graph meta generator',
  path: '/og-meta-generator',
  description: 'Generate open-graph and socials html meta tags for your website.',
  keywords: [
    'meta',
    'tag',
    'generator',
    'social',
    'title',
    'description',
    'image',
    'share',
    'online',
    'website',
    'open',
    'graph',
    'og',
  ],
  component: () => import('./meta-tag-generator.vue'),
  icon: Tags,
});
