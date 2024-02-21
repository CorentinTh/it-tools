import type { OGSchemaType } from '../OGSchemaType.type';
import { translate as t } from '@/plugins/i18n.plugin';

export const article: OGSchemaType = {
  name: t('tools.og-meta-generator.article.title'),
  elements: [
    {
      type: 'input',
      label: t('tools.og-meta-generator.article.publishingDate.label'),
      key: 'article:published_time',
      placeholder: t('tools.og-meta-generator.article.publishingDate.placeholder'),
    },
    {
      type: 'input',
      label: t('tools.og-meta-generator.article.modificationDate.label'),
      key: 'article:modified_time',
      placeholder: t('tools.og-meta-generator.article.modificationDate.placeholder'),
    },
    {
      type: 'input',
      label: t('tools.og-meta-generator.article.expirationDate.label'),
      key: 'article:expiration_time',
      placeholder: t('tools.og-meta-generator.article.expirationDate.placeholder'),
    },
    {
      type: 'input',
      label: t('tools.og-meta-generator.article.author.label'),
      key: 'article:author',
      placeholder: t('tools.og-meta-generator.article.author.placeholder'),
    },
    {
      type: 'input',
      label: t('tools.og-meta-generator.article.section.label'),
      key: 'article:section',
      placeholder: t('tools.og-meta-generator.article.section.placeholder'),
    },
    {
      type: 'input',
      label: t('tools.og-meta-generator.article.tag.label'),
      key: 'article:tag',
      placeholder: t('tools.og-meta-generator.article.tag.placeholder'),
    },
  ],
};
