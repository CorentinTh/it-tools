import { ArrowsLeftRight } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '数字进制转换器',
  path: '/base-converter',
  description: '将数字在不同进制之间相互转换（二进制、八进制、十进制、十六进制、base64...）',
  keywords: ['整数', '数字', '进制', '转换器', '二进制', '八进制', '十进制', '十六进制', 'base64'],
  component: () => import('./integer-base-converter.vue'),
  icon: ArrowsLeftRight,
});
