import { LetterX } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '罗马数字 ↔ 阿拉伯数字',
  path: '/roman-numeral-converter',
  description: '罗马数字 和 阿拉伯数字 互转',
  keywords: ['罗马', '数字', '转', '转换', '互转', '转换器', 'X', 'I', 'V', 'L', 'C', 'D', 'M'],
  component: () => import('./roman-numeral-converter.vue'),
  icon: LetterX,
});
