import type { OGSchemaType } from '../OGSchemaType.type';

export const profile: OGSchemaType = {
  name: 'Profile',
  elements: [
    {
      type: 'input',
      label: 'First name',
      placeholder: 'Enter the first name of the person...',
      key: 'profile:first_name',
    },
    {
      type: 'input',
      label: 'Last name',
      placeholder: 'Enter the last name of the person...',
      key: 'profile:last_name',
    },
    { type: 'input', label: 'Username', placeholder: 'Enter the username of the person...', key: 'profile:username' },
    { type: 'input', label: 'Gender', placeholder: 'Enter the gender of the person...', key: 'profile:gender' },
  ],
};
