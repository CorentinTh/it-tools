import type { OGSchemaType } from '../OGSchemaType.type';
import { videoMovie } from './videoMovie';

export const videoEpisode: OGSchemaType = {
  name: '电视剧详情',
  elements: [
    ...videoMovie.elements,
    { type: 'input', label: '电视剧名称', key: 'video:series', placeholder: '请输入电视剧名称' },
  ],
};
