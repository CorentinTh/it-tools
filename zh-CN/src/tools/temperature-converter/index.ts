import { Temperature } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '温度转换器',
  path: '/temperature-converter',
  description: '开尔文、摄氏度、华氏度、兰金、德莱尔、牛顿、雷奥穆尔和罗默温度转换。',
  keywords: [
    '温度',
    '转换器',
    '度',
    '开尔文',
    '摄氏度',
    '华氏度',
    '兰金',
    '德莱尔',
    '牛顿',
    '雷奥穆尔',
    '罗默',
  ],
  component: () => import('./temperature-converter.vue'),
  icon: Temperature,
});
