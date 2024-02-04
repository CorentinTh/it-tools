import { Fingerprint } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'UUID 生成器',
  path: '/uuid-generator',
  description: '通用唯一标识符 (UUID) 是一个 128 位数字，用于识别计算机系统中的信息',
  keywords: ['uuid', 'v4', '随机', 'id', '数字', '唯一', 'token', '字符串', '标识符', '通用', 'v1', 'v3', 'v5', 'nil'],
  component: () => import('./uuid-generator.vue'),
  icon: Fingerprint,
});
