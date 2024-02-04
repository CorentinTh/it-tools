import type { OGSchemaType } from '../OGSchemaType.type';

export const musicPlaylist: OGSchemaType = {
  name: '歌单详情',
  elements: [
    { type: 'input-multiple', label: '歌曲名称', key: 'music:song', placeholder: '请输入歌曲名称' },
    {
      type: 'input',
      label: '曲目编号',
      key: 'music:song:track',
      placeholder: '请输入曲目编号',
    },
    { type: 'input-multiple', label: '创建者', key: 'music:creator', placeholder: '请输入创建者' },
  ],
};
