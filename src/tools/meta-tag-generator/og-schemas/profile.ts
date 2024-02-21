import type { OGSchemaType } from '../OGSchemaType.type';
import { translate as t } from '@/plugins/i18n.plugin';

export const profile: OGSchemaType = {
  name: t('tools.og-meta-generator.profile.title'),
  elements: [
    {
      type: 'input',
      label: t('tools.og-meta-generator.profile.firstName.lebel'),
      placeholder: t('tools.og-meta-generator.profile.firstName.placeholder'),
      key: 'profile:first_name',
    },
    {
      type: 'input',
      label: t('tools.og-meta-generator.profile.lastName.lebel'),
      placeholder: t('tools.og-meta-generator.profile.lastName.placeholder'),
      key: 'profile:last_name',
    },
    { type: 'input', label: t('tools.og-meta-generator.profile.username.lebel'), placeholder: t('tools.og-meta-generator.profile.username.placeholder'), key: 'profile:username' },
    { type: 'input', label: t('tools.og-meta-generator.profile.gender.lebel'), placeholder: t('tools.og-meta-generator.profile.gender.placeholder'), key: 'profile:gender' },
  ],
};
