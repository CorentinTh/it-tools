import { defineTool } from '../tool';
import FileCertIcon from '~icons/mdi/file-certificate-outline';

export const tool = defineTool({
  name: 'PDF signature checker',
  path: '/pdf-signature-checker',
  description: 'Verify the signatures of a PDF file. A signed PDF file contains one or more signatures that may be used to determine whether the contents of the file have been altered since the file was signed.',
  keywords: ['pdf', 'signature', 'checker', 'verify', 'validate', 'sign'],
  component: () => import('./pdf-signature-checker.vue'),
  icon: FileCertIcon,
  createdAt: new Date('2023-12-09'),
});
