import { defineTool } from '../tool';
import Bank from '~icons/mdi/bank';

export const tool = defineTool({
  name: 'IBAN 验证器和解析器',
  path: '/iban-validator-and-parser',
  description: '验证并解析 IBAN 号码。 检查 IBAN 是否有效，并获取国家/地区、BBAN（如果是 QR-IBAN）以及 IBAN 友好格式。',
  keywords: ['iban', '验证器', '和', '解析器', 'bic', '银行'],
  component: () => import('./iban-validator-and-parser.vue'),
  icon: Bank,
  createdAt: new Date('2023-08-26'),
});
