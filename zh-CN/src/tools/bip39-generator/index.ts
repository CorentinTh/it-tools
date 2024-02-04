import { AlignJustified } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'BIP39 密码生成器',
  path: '/bip39-generator',
  description: '从现有或随机助记词生成 BIP39 密码，或从密码中获取助记词。',
  keywords: ['BIP39', '密码短语', '生成', '助记词', '熵'],
  component: () => import('./bip39-generator.vue'),
  icon: AlignJustified,
});
