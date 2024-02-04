import { HttpRound } from '@vicons/material';
import { defineTool } from '../tool';

import { codesByCategories } from './http-status-codes.constants';

export const tool = defineTool({
  name: 'HTTP 状态码',
  path: '/http-status-codes',
  description: '所有 HTTP 状态代码、名称及其含义的列表。',
  keywords: [
    'http',
    '状态',
    '代码',
    ...codesByCategories.flatMap(({ codes }) => codes.flatMap(({ code, name }) => [String(code), name])),
  ],
  component: () => import('./http-status-codes.vue'),
  icon: HttpRound,
  createdAt: new Date('2023-04-13'),
});
