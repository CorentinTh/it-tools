import type { OGSchemaType } from '../OGSchemaType.type';

const typeOptions = [
  { label: '🌐 网站', value: 'website' },
  { label: '📃 文章', value: 'article' },
  { label: '📖 书籍', value: 'book' },
  { label: '🙋 个人简介', value: 'profile' },
  // 音乐
  { label: '🎵 [音乐] 歌曲', value: 'music.song' },
  { label: '🎵 [音乐] 专辑', value: 'music.album' },
  { label: '🎵 [音乐] 歌单', value: 'music.playlist' },
  { label: '🎵 [音乐] 电台', value: 'music.radio_station' },
  // 视频
  { label: '🎞️ [视频] 电影', value: 'video.movie' },
  { label: '🎞️ [视频] 电视剧', value: 'video.episode' },
  { label: '🎞️ [视频] 电视节目', value: 'video.tv_show' },
  { label: '🎞️ [视频] 其他', value: 'video.other' },
  // {
  //   type: 'group',
  //   label: '音乐',
  //   key: 'Music',
  //   children: [
  //     { label: '歌曲', value: 'music.song' },
  //     { label: '专辑', value: 'music.album' },
  //     { label: '歌单', value: 'music.playlist' },
  //     { label: '电台', value: 'music.radio_station' },
  //   ],
  // },
  // {
  //   type: 'group',
  //   label: '视频',
  //   key: 'Video',
  //   children: [
  //     { label: '电影', value: 'video.movie' },
  //     { label: '剧集', value: 'video.episode' },
  //     { label: '电视剧', value: 'video.tv_show' },
  //     { label: '其他', value: 'video.other' },
  //   ],
  // },
];

export const website: OGSchemaType = {
  name: '基本信息',
  elements: [
    {
      type: 'select',
      label: '页面类型',
      placeholder: '选择页面类型',
      key: 'type',
      options: typeOptions,
    },
    { type: 'input', label: '标题', placeholder: '输入网站标题', key: 'title' },
    {
      type: 'input',
      label: '描述',
      placeholder: '输入网站描述',
      key: 'description',
    },
    {
      type: 'input',
      label: '页面URL',
      placeholder: '输入页面URL',
      key: 'url',
    },
  ],
};
