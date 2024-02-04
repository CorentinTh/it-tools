import { Certificate } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'RSA 密钥对生成器',
  path: '/rsa-key-pair-generator',
  description: '生成新的随机 RSA 私钥和 pem 公钥证书。',
  keywords: ['rsa', '密钥', '密钥对', '生成', '公钥', '私钥', 'secret', 'ssh', 'pem'],
  component: () => import('./rsa-key-pair-generator.vue'),
  icon: Certificate,
});
