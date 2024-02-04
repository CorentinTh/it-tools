import type { OGSchemaType } from '../OGSchemaType.type';

export const image: OGSchemaType = {
  name: '图片',
  elements: [
    {
      type: 'input',
      label: '图片URL',
      placeholder: '请输入图片的URL',
      key: 'image',
    },
    {
      type: 'input',
      label: '图片替代文本',
      placeholder: '请输入图片的替代文本',
      key: 'image:alt',
    },
    {
      type: 'input',
      label: '宽度',
      placeholder: '请输入图片的宽度（以像素为单位）',
      key: 'image:width',
    },
    {
      type: 'input',
      label: '高度',
      placeholder: '请输入图片的高度（以像素为单位）',
      key: 'image:height',
    },
  ],
};
