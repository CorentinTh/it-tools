import { Camera } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.camera-recorder.title'),
  path: '/camera-recorder',
  description: t('tools.camera-recorder.description'),
  keywords: ['camera', 'recoder'],
  component: () => import('./camera-recorder.vue'),
  icon: Camera,
  createdAt: new Date('2023-05-15'),
});
