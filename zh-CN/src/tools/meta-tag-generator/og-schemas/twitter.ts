import type { OGSchemaType } from '../OGSchemaType.type';

export const twitter: OGSchemaType = {
  name: 'Twitter 推特',
  elements: [
    {
      type: 'select',
      options: [
        { label: '摘要', value: 'summary' },
        { label: '摘要-大图', value: 'summary_large_image' },
        { label: '应用程序', value: 'app' },
        { label: '播放器', value: 'player' },
      ],
      label: '卡片类型',
      placeholder: '推特的卡片类型',
      key: 'twitter:card',
    },
    {
      type: 'input',
      label: '网站推特帐户',
      placeholder: '网站的推特帐户名称，例如：@ittoolsdottech',
      key: 'twitter:site',
    },
    {
      type: 'input',
      label: '作者推特帐户',
      placeholder: '作者的推特帐户名称，例如：@cthmsst',
      key: 'twitter:creator',
    },
  ],
};
