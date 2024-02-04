import type { OGSchemaType } from '../OGSchemaType.type';
import { videoMovie } from './videoMovie';

export const videoTVShow: OGSchemaType = {
  name: '电视节目详情',
  elements: [...videoMovie.elements],
};
