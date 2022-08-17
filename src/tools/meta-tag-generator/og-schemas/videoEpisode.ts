import type { OGSchemaType } from '../OGSchemaType.type';
import { videoMovie } from './videoMovie';

export const videoEpisode: OGSchemaType = {
  name: 'Video episode details',
  elements: [
    ...videoMovie.elements,
    { type: 'input', label: 'Series', key: 'video:series', placeholder: 'Which series this episode belongs to...' },
  ],
};
