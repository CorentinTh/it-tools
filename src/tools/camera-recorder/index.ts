import { Camera } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Images and videos',
  order: 7,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.camera-recorder.title'),
  path: '/camera-recorder',
  description: translate('tools.camera-recorder.description'),
  keywords: ['camera', 'recoder'],
  component: () => import('./camera-recorder.vue'),
  icon: Camera,
  createdAt: new Date('2023-05-15'),
});
