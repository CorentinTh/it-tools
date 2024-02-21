import type { OGSchemaType } from '../OGSchemaType.type';
import { translate as t } from '@/plugins/i18n.plugin';

export const videoMovie: OGSchemaType = {
  name: t('tools.og-meta-generator.videoMovie.title'),
  elements: [
    {
      type: 'input-multiple',
      label: t('tools.og-meta-generator.videoMovie.actor.label'),
      key: 'video:actor',
      placeholder: t('tools.og-meta-generator.videoMovie.actor.placeholder'),
    },
    // { type: 'input', label: t('tools.og-meta-generator.videoMovie.actorRole.label'), key: 'video:actor:role', placeholder: t('tools.og-meta-generator.videoMovie.actorRole.placeholder') },
    {
      type: 'input-multiple',
      label: t('tools.og-meta-generator.videoMovie.director.label'),
      key: 'video:director',
      placeholder: t('tools.og-meta-generator.videoMovie.director.placeholder'),
    },
    { type: 'input-multiple', label: t('tools.og-meta-generator.videoMovie.writer.label'), key: 'video:writer', placeholder: t('tools.og-meta-generator.videoMovie.writer.placeholder') },
    { type: 'input', label: t('tools.og-meta-generator.videoMovie.duration.label'), key: 'video:duration', placeholder: t('tools.og-meta-generator.videoMovie.duration.placeholder') },
    {
      type: 'input',
      label: t('tools.og-meta-generator.videoMovie.releaseDate.label'),
      key: 'video:release_date',
      placeholder: t('tools.og-meta-generator.videoMovie.releaseDate.placeholder'),
    },
    { type: 'input', label: t('tools.og-meta-generator.videoMovie.tag.label'), key: 'video:tag', placeholder: t('tools.og-meta-generator.videoMovie.tag.placeholder') },
  ],
};
