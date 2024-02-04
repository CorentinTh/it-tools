import type { OGSchemaType } from '../OGSchemaType.type';

export const videoMovie: OGSchemaType = {
  name: '电影详情',
  elements: [
    {
      type: 'input-multiple',
      label: '演员',
      key: 'video:actor',
      placeholder: '请输入演员姓名',
    },
    // { type: 'input', label: 'Actor role', key: 'video:actor:role', placeholder: 'The role they played...' },
    {
      type: 'input-multiple',
      label: '导演',
      key: 'video:director',
      placeholder: '请输入导演姓名',
    },
    { type: 'input-multiple', label: '编剧', key: 'video:writer', placeholder: '请输入编剧姓名' },
    { type: 'input', label: '持续时间', key: 'video:duration', placeholder: '请输入持续时间（以秒为单位）' },
    {
      type: 'input',
      label: '发布日期',
      key: 'video:release_date',
      placeholder: '请输入发布日期，格式：2023-09-02',
    },
    { type: 'input', label: '标签', key: 'video:tag', placeholder: '请输入标签词' },
  ],
};
