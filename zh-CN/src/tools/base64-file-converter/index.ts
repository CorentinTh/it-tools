import { FileDigit } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Base64 ↔ 文件',
  path: '/base64-file-converter',
  description: 'Base64和文件互转',
  keywords: ['base64', '转换器', '上传', '图片', '文件', '转', '互转', '转换', 'web', '数据', '格式'],
  component: () => import('./base64-file-converter.vue'),
  icon: FileDigit,
});
