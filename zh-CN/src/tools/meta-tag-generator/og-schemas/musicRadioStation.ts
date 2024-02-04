import type { OGSchemaType } from '../OGSchemaType.type';

export const musicRadioStation: OGSchemaType = {
  name: '电台详情',
  elements: [
    { type: 'input-multiple', label: '创建者', key: 'music:creator', placeholder: '请输入创建者' },
    { type: 'input', label: '广播URL', key: 'audio', placeholder: '请输入实际广播流的URL' },
  ],
};
