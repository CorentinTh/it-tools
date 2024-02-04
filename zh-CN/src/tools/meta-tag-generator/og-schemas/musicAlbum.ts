import type { OGSchemaType } from '../OGSchemaType.type';

export const musicAlbum: OGSchemaType = {
  name: '音乐专辑详情',
  elements: [
    { type: 'input-multiple', label: '歌曲名称', key: 'music:song', placeholder: '请输入歌曲名称' },
    {
      type: 'input',
      label: '光盘编号',
      key: 'music:song:disc',
      placeholder: '请输入光盘编号',
    },
    {
      type: 'input',
      label: '曲目编号',
      key: 'music:song:track',
      placeholder: '请输入曲目编号',
    },
    { type: 'input-multiple', label: '艺术家', key: 'music:musician', placeholder: '请输入艺术家' },
    {
      type: 'input',
      label: '发布日期',
      key: 'music:release_date',
      placeholder: '请输入发布日期，格式：2023-09-02',
    },
  ],
};
