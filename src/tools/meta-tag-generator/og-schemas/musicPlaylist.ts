import type { OGSchemaType } from '../OGSchemaType.type';

export const musicPlaylist: OGSchemaType = {
  name: 'Playlist details',
  elements: [
    { type: 'input', label: 'Song', key: 'music:song', placeholder: 'The song on this album...' },
    {
      type: 'input',
      label: 'Disc',
      key: 'music:song:disc',
      placeholder: 'The same as music:album:disc but in reverse...',
    },
    {
      type: 'input',
      label: 'Track',
      key: 'music:song:track',
      placeholder: 'The same as music:album:track but in reverse...',
    },
    { type: 'input', label: 'Creator', key: 'music:creator', placeholder: 'The creator of this playlist...' },
  ],
};
