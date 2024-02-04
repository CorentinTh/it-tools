import { BrandDocker } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Docker run 转 compose',
  path: '/docker-run-to-docker-compose-converter',
  description: '将 docker run 命令转换为 docker-compose 文件',
  keywords: ['docker', 'run', 'compose', 'yaml', 'yml', '转换', 'deamon'],
  component: () => import('./docker-run-to-docker-compose-converter.vue'),
  icon: BrandDocker,
});
