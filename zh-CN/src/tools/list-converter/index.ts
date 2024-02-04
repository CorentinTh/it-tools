import { List } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '列表转换器',
  path: '/list-converter',
  description:
    '该工具可以处理基于列的数据并对每行应用各种更改（转置、添加前缀、添加后缀、反向、排序、小写、截断、去除空格、去重）。',
  keywords: ['列表', '转换器', '排序', '转置', '前缀', '后缀', '小写', '截断', '去重'],
  component: () => import('./list-converter.vue'),
  icon: List,
  createdAt: new Date('2023-05-07'),
});
