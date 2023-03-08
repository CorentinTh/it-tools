import type { OGSchemaType } from '../OGSchemaType.type';

export const twitter: OGSchemaType = {
  name: 'Twitter',
  elements: [
    {
      type: 'select',
      options: [
        { label: 'Summary', value: 'summary' },
        { label: 'Summary with large image', value: 'summary_large_image' },
        { label: 'Application', value: 'app' },
        { label: 'Player', value: 'player' },
      ],
      label: 'Card type',
      placeholder: 'The Twitter card type...',
      key: 'twitter:card',
    },
    {
      type: 'input',
      label: 'Site account',
      placeholder: 'The name of the Twitter account of the site (ex: @ittoolsdottech)...',
      key: 'twitter:site',
    },
    {
      type: 'input',
      label: 'Creator acc.',
      placeholder: 'The name of the Twitter account of the creator (ex: @cthmsst)...',
      key: 'twitter:creator',
    },
  ],
};
