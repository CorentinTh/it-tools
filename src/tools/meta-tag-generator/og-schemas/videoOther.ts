import type { OGSchemaType } from '../OGSchemaType.type';
import { videoMovie } from './videoMovie';
import { translate as t } from '@/plugins/i18n.plugin';

export const videoOther: OGSchemaType = {
  name: t('tools.og-meta-generator.videoOther.title'),
  elements: [...videoMovie.elements],
};
