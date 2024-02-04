import { EyeOff } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '字符串脱敏',
  path: '/string-obfuscator',
  description: '混淆字符串（如手机号、车牌号或秘钥），保留格式的情况下进行脱敏。',
  keywords: ['字符串', '脱敏', '手机号', '车牌号', '隐藏', '秘钥', '格式'],
  component: () => import('./string-obfuscator.vue'),
  icon: EyeOff,
  createdAt: new Date('2023-08-16'),
});
