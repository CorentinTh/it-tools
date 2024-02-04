import { World } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Mime 类型 ↔ 扩展名',
  path: '/mime-types',
  description: 'mime 类型 和 扩展名 互转',
  keywords: ['mime', '类型', '转', '转换', '互转', '扩展名', '后缀名', '文件'],
  component: () => import('./mime-types.vue'),
  icon: World,
});
