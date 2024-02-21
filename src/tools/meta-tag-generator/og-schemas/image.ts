import type { OGSchemaType } from '../OGSchemaType.type';
import { translate as t } from '@/plugins/i18n.plugin';

export const image: OGSchemaType = {
  name: t('tools.og-meta-generator.image.title'),
  elements: [
    {
      type: 'input',
      label: t('tools.og-meta-generator.image.imageUrl.label'),
      placeholder: t('tools.og-meta-generator.image.imageUrl.placeholder'),
      key: 'image',
    },
    {
      type: 'input',
      label: t('tools.og-meta-generator.image.imageAlt.label'),
      placeholder: t('tools.og-meta-generator.image.imageAlt.placeholder'),
      key: 'image:alt',
    },
    {
      type: 'input',
      label: t('tools.og-meta-generator.image.width.label'),
      placeholder: t('tools.og-meta-generator.image.width.placeholder'),
      key: 'image:width',
    },
    {
      type: 'input',
      label: t('tools.og-meta-generator.image.height.label'),
      placeholder: t('tools.og-meta-generator.image.height.placeholder'),
      key: 'image:height',
    },
  ],
};
