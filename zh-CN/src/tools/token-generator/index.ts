import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: '随机字符生成器',
  path: '/token-generator',
  description: '使用字符、大写字母、小写字母、数字、符号生成随机字符串，可用于token、密码、秘钥等。',
  keywords: ['token', '密码', '秘钥', '随机', '字符', '字符串', '字母', '符号', '数字', '小写', '大写', '密码'],
  component: () => import('./token-generator.tool.vue'),
  icon: ArrowsShuffle,
});
