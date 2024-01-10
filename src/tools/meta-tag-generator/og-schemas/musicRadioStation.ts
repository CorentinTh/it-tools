import type { OGSchemaType } from '../OGSchemaType.type';
import { translate as t } from '@/plugins/i18n.plugin';

export const musicRadioStation: OGSchemaType = {
  name: t('tools.og-meta-generator.radioStationDetails.title'),
  elements: [
    { type: 'input', label: t('tools.og-meta-generator.radioStationDetails.creator.label'), key: 'music:creator', placeholder: t('tools.og-meta-generator.radioStationDetails.creator.placeholder') },
  ],
};
