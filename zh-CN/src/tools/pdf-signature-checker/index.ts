import { defineTool } from '../tool';
import FileCertIcon from '~icons/mdi/file-certificate-outline';

export const tool = defineTool({
  name: 'PDF签名检查器',
  path: '/pdf-signature-checker',
  description: '验证PDF文件的签名，用于确定文件内容自签名以来是否被更改过。',
  keywords: ['pdf', 'signature', 'checker', 'verify', 'validate', 'sign'],
  component: () => import('./pdf-signature-checker.vue'),
  icon: FileCertIcon,
  createdAt: new Date('2023-12-09'),
});
