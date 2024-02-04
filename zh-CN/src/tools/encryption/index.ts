import { Lock } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '加密/解密文本',
  path: '/encryption',
  description: '使用 AES、TripleDES、Rabbit 或 RC4 等加密算法对文本明文进行加密和解密。',
  keywords: ['暗号', '加密', '文本', 'AES', 'TripleDES', 'Rabbit', 'RC4'],
  component: () => import('./encryption.vue'),
  icon: Lock,
  redirectFrom: ['/cypher'],
});
