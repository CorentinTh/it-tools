import type { OGSchemaType } from '../OGSchemaType.type';
import { translate as t } from '@/plugins/i18n.plugin';

export const musicAlbum: OGSchemaType = {
  name: t('tools.og-meta-generator.albumDetails.title'),
  elements: [
    { type: 'input', label: t('tools.og-meta-generator.albumDetails.song.label'), key: 'music:song', placeholder: t('tools.og-meta-generator.albumDetails.song.placeholder') },
    {
      type: 'input',
      label: t('tools.og-meta-generator.albumDetails.disc.label'),
      key: 'music:song:disc',
      placeholder: t('tools.og-meta-generator.albumDetails.disc.placeholder'),
    },
    {
      type: 'input',
      label: t('tools.og-meta-generator.albumDetails.track.label'),
      key: 'music:song:track',
      placeholder: t('tools.og-meta-generator.albumDetails.track.placeholder'),
    },
    { type: 'input', label: t('tools.og-meta-generator.albumDetails.musician.label'), key: 'music:musician', placeholder: t('tools.og-meta-generator.albumDetails.musician.placeholder') },
    {
      type: 'input',
      label: t('tools.og-meta-generator.albumDetails.releaseDate.label'),
      key: 'music:release_date',
      placeholder: t('tools.og-meta-generator.albumDetails.releaseDate.placeholder'),
    },
  ],
};
