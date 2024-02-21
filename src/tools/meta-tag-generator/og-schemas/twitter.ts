import type { OGSchemaType } from '../OGSchemaType.type';
import { translate as t } from '@/plugins/i18n.plugin';

export const twitter: OGSchemaType = {
  name: t('tools.og-meta-generator.twitter.title'),
  elements: [
    {
      type: 'select',
      options: [
        { label: t('tools.og-meta-generator.twitter.card.summary'), value: 'summary' },
        { label: t('tools.og-meta-generator.twitter.card.summaryWithLargeImage'), value: 'summary_large_image' },
        { label: t('tools.og-meta-generator.twitter.card.application'), value: 'app' },
        { label: t('tools.og-meta-generator.twitter.card.player'), value: 'player' },
      ],
      label: t('tools.og-meta-generator.twitter.card.label'),
      placeholder: t('tools.og-meta-generator.twitter.card.placeholder'),
      key: 'twitter:card',
    },
    {
      type: 'input',
      label: t('tools.og-meta-generator.twitter.site.label'),
      placeholder: t('tools.og-meta-generator.twitter.site.placeholder', { example: '@ittoolsdottech' }),
      key: 'twitter:site',
    },
    {
      type: 'input',
      label: t('tools.og-meta-generator.twitter.creator.label'),
      placeholder: t('tools.og-meta-generator.twitter.creator.placeholder', { example: '@cthmsst' }),
      key: 'twitter:creator',
    },
  ],
};
