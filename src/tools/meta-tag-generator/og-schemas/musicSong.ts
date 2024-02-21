import type { OGSchemaType } from '../OGSchemaType.type';
import { translate as t } from '@/plugins/i18n.plugin';

export const musicSong: OGSchemaType = {
  name: t('tools.og-meta-generator.songDetails.title'),
  elements: [
    { type: 'input', label: t('tools.og-meta-generator.songDetails.duration.lebel'), placeholder: t('tools.og-meta-generator.songDetails.duration.placeholder'), key: 'music:duration' },
    { type: 'input', label: t('tools.og-meta-generator.songDetails.album.lebel'), placeholder: t('tools.og-meta-generator.songDetails.album.placeholder'), key: 'music:album' },
    {
      type: 'input',
      label: t('tools.og-meta-generator.songDetails.disc.lebel'),
      placeholder: t('tools.og-meta-generator.songDetails.disc.placeholder'),
      key: 'music:album:disk',
    },
    { type: 'input', label: t('tools.og-meta-generator.songDetails.track.lebel'), placeholder: t('tools.og-meta-generator.songDetails.track.placeholder'), key: 'music:album:track' },
    {
      type: 'input-multiple',
      label: t('tools.og-meta-generator.songDetails.musician.lebel'),
      placeholder: t('tools.og-meta-generator.songDetails.musician.placeholder'),
      key: 'music:musician',
    },
  ],
};
