import { Books } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'ISBN Validator and Parser',
  path: '/isbn-validator-and-parser',
  description: 'Parse, validate, format and get infos for an ISBN',
  keywords: ['isbn', 'validator', 'parser', 'formatter'],
  component: () => import('./isbn-validator-and-parser.vue'),
  icon: Books,
  createdAt: new Date('2024-01-10'),
});
