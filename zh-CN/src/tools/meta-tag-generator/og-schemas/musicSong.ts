import type { OGSchemaType } from '../OGSchemaType.type';

export const musicSong: OGSchemaType = {
  name: '歌曲详情',
  elements: [
    { type: 'input', label: '持续时间', placeholder: '请输入持续时间（以秒为单位）', key: 'music:duration' },
    { type: 'input-multiple', label: '所属专辑', placeholder: '请输入所属专辑', key: 'music:album' },
    {
      type: 'input',
      label: '光盘编号',
      placeholder: '请输入光盘编号',
      key: 'music:album:disk',
    },
    { type: 'input', label: '曲目编号', placeholder: '请输入曲目编号', key: 'music:album:track' },
    {
      type: 'input-multiple',
      label: '艺术家',
      placeholder: '请输入艺术家',
      key: 'music:musician',
    },
  ],
};
