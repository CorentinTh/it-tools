import type { OGSchemaType } from '../OGSchemaType.type';
import { translate as t } from '@/plugins/i18n.plugin';

export const book: OGSchemaType = {
  name: t('tools.og-meta-generator.book.title'),
  elements: [
    { type: 'input', label: t('tools.og-meta-generator.book.author.label'), key: 'book:author', placeholder: t('tools.og-meta-generator.book.author.placeholder') },
    { type: 'input', label: t('tools.og-meta-generator.book.ISBN.label'), key: 'book:isbn', placeholder: t('tools.og-meta-generator.book.ISBN.placeholder') },
    {
      type: 'input',
      label: t('tools.og-meta-generator.book.releaseDate.label'),
      key: 'book:release_date',
      placeholder: t('tools.og-meta-generator.book.releaseDate.placeholder'),
    },
    { type: 'input', label: t('tools.og-meta-generator.book.tag.label'), key: 'book:tag', placeholder: t('tools.og-meta-generator.book.tag.placeholder') },
  ],
};
