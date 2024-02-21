import type { OGSchemaType } from '../OGSchemaType.type';
import { videoMovie } from './videoMovie';
import { translate as t } from '@/plugins/i18n.plugin';

export const videoEpisode: OGSchemaType = {
  name: t('tools.og-meta-generator.videoEpisode.title'),
  elements: [
    ...videoMovie.elements,
    { type: 'input', label: t('tools.og-meta-generator.videoEpisode.series.label'), key: 'video:series', placeholder: t('tools.og-meta-generator.videoEpisode.series.placeholder') },
  ],
};
