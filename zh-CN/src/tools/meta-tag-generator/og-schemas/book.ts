import type { OGSchemaType } from '../OGSchemaType.type';

export const book: OGSchemaType = {
  name: '书籍',
  elements: [
    { type: 'input', label: '作者', key: 'book:author', placeholder: '请输入作者是谁' },
    { type: 'input', label: 'ISBN', key: 'book:isbn', placeholder: '请输入 ISBN 国际标准书号...' },
    {
      type: 'input',
      label: '发布日期',
      key: 'book:release_date',
      placeholder: '请输入发布日期',
    },
    { type: 'input', label: '标签', key: 'book:tag', placeholder: '请输入标签词' },
  ],
};
