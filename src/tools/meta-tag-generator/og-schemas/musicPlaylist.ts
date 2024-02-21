import type { OGSchemaType } from '../OGSchemaType.type';
import { translate as t } from '@/plugins/i18n.plugin';

export const musicPlaylist: OGSchemaType = {
  name: t('tools.og-meta-generator.playlistDetails.title'),
  elements: [
    { type: 'input', label: t('tools.og-meta-generator.playlistDetails.song.label'), key: 'music:song', placeholder: t('tools.og-meta-generator.playlistDetails.song.placeholder') },
    {
      type: 'input',
      label: t('tools.og-meta-generator.playlistDetails.disc.label'),
      key: 'music:song:disc',
      placeholder: t('tools.og-meta-generator.playlistDetails.disc.placeholder'),
    },
    {
      type: 'input',
      label: t('tools.og-meta-generator.playlistDetails.track.label'),
      key: 'music:song:track',
      placeholder: t('tools.og-meta-generator.playlistDetails.track.placeholder'),
    },
    { type: 'input', label: t('tools.og-meta-generator.playlistDetails.creator.label'), key: 'music:creator', placeholder: t('tools.og-meta-generator.playlistDetails.creator.placeholder') },
  ],
};
