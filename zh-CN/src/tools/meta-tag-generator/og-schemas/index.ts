import type { OGSchemaType } from '../OGSchemaType.type';

import { article } from './article';
import { book } from './book';
import { musicAlbum } from './musicAlbum';
import { musicPlaylist } from './musicPlaylist';
import { musicRadioStation } from './musicRadioStation';
import { musicSong } from './musicSong';
import { profile } from './profile';
import { videoEpisode } from './videoEpisode';
import { videoMovie } from './videoMovie';
import { videoOther } from './videoOther';
import { videoTVShow } from './videoTVShow';

export * from './image';
export * from './twitter';
export * from './website';

export const ogSchemas: Record<string, OGSchemaType> = {
  'music.song': musicSong,
  'music.album': musicAlbum,
  'music.playlist': musicPlaylist,
  'music.radio_station': musicRadioStation,
  'video.movie': videoMovie,
  'video.episode': videoEpisode,
  'video.tv_show': videoTVShow,
  'video.other': videoOther,
  profile,
  article,
  book,
};
