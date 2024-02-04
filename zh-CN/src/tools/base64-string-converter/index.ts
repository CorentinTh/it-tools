import { FileDigit } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Base64 ↔ 字符串',
  path: '/base64-string-converter',
  description: 'Base64和字符串互转',
  keywords: ['base64', '转换器', '转', '互转', '转换', 'web', '数据', '格式'],
  component: () => import('./base64-string-converter.vue'),
  icon: FileDigit,
  redirectFrom: ['/file-to-base64', '/base64-converter'],
});
