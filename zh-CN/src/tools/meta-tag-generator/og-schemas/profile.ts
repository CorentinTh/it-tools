import type { OGSchemaType } from '../OGSchemaType.type';

export const profile: OGSchemaType = {
  name: '个人简介',
  elements: [
    {
      type: 'input',
      label: '姓',
      placeholder: '请输入姓氏',
      key: 'profile:last_name',
    },
    {
      type: 'input',
      label: '名',
      placeholder: '请输入名字',
      key: 'profile:first_name',
    },
    { type: 'input', label: '用户名', placeholder: '请输入用户名', key: 'profile:username' },
    { type: 'input', label: '性别', placeholder: '请输入性别', key: 'profile:gender' },
  ],
};
