import type { OGSchemaType } from '../OGSchemaType.type';
import { videoMovie } from './videoMovie';

export const videoOther: OGSchemaType = {
  name: '其他视频详情',
  elements: [...videoMovie.elements],
};
