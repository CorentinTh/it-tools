import type { OGSchemaType } from '../OGSchemaType.type';

export const article: OGSchemaType = {
  name: '文章',
  elements: [
    {
      type: 'input',
      label: '发布日期',
      key: 'article:published_time',
      placeholder: '请输入首次发表时间',
    },
    {
      type: 'input',
      label: '修改日期',
      key: 'article:modified_time',
      placeholder: '请输入最后修改日期',
    },
    {
      type: 'input',
      label: '过期时间',
      key: 'article:expiration_time',
      placeholder: '请输入过期时间',
    },
    { type: 'input', label: '作者', key: 'article:author', placeholder: '请输入作者' },
    {
      type: 'input',
      label: '部分',
      key: 'article:section',
      placeholder: '请输入高级部分名称，例如：技术...',
    },
    { type: 'input', label: '标签', key: 'article:tag', placeholder: '请输入标签词' },
  ],
};
