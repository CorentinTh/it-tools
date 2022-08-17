import type { OGSchemaType } from '../OGSchemaType.type';

export const article: OGSchemaType = {
  name: 'Article',
  elements: [
    {
      type: 'input',
      label: 'Publishing date',
      key: 'article:published_time',
      placeholder: 'When the article was first published...',
    },
    {
      type: 'input',
      label: 'Modification date',
      key: 'article:modified_time',
      placeholder: 'When the article was last changed...',
    },
    {
      type: 'input',
      label: 'Expiration date',
      key: 'article:expiration_time',
      placeholder: 'When the article is out of date after...',
    },
    { type: 'input', label: 'Author', key: 'article:author', placeholder: 'Writers of the article...' },
    {
      type: 'input',
      label: 'Section',
      key: 'article:section',
      placeholder: 'A high-level section name. E.g. Technology..',
    },
    { type: 'input', label: 'Tag', key: 'article:tag', placeholder: 'Tag words associated with this article...' },
  ],
};
