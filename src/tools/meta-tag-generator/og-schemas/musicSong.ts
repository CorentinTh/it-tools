import type { OGSchemaType } from '../OGSchemaType.type';

export const musicSong: OGSchemaType = {
  name: 'Song details',
  elements: [
    { type: 'input', label: 'Duration', placeholder: 'The duration of the song...', key: 'music:duration' },
    { type: 'input', label: 'Album', placeholder: 'The album this song is from...', key: 'music:album' },
    {
      type: 'input',
      label: 'Disc',
      placeholder: 'Which disc of the album this song is on...',
      key: 'music:album:disk',
    },
    { type: 'input', label: 'Track', placeholder: ' Which track this song is...', key: 'music:album:track' },
    {
      type: 'input-multiple',
      label: 'Musician',
      placeholder: 'The musician that made this song...',
      key: 'music:musician',
    },
  ],
};
