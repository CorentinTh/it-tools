import { ImageOutlined } from '@vicons/material';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Images and videos',
  order: 5,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.favicon-app-icon-generator.title'),
  path: '/favicon-app-icon-generator',
  description: translate('tools.favicon-app-icon-generator.description'),
  keywords: ['favicon', 'app icon', 'pwa', 'manifest', 'apple touch icon', 'maskable', 'png', 'canvas'],
  component: () => import('./favicon-app-icon-generator.vue'),
  icon: ImageOutlined,
});
