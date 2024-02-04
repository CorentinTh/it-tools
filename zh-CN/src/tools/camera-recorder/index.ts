import { Camera } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '在线摄像头',
  path: '/camera-recorder',
  description: '通过浏览器调用你的电脑摄像头来拍摄照片或录制视频。',
  keywords: ['摄像头', '摄像机'],
  component: () => import('./camera-recorder.vue'),
  icon: Camera,
  createdAt: new Date('2023-05-15'),
});
