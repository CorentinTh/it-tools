import type { OGSchemaType } from '../OGSchemaType.type';
import { translate as t } from '@/plugins/i18n.plugin';

const typeOptions = [
  { label: t('tools.og-meta-generator.website.web'), value: 'website' },
  { label: t('tools.og-meta-generator.website.article'), value: 'article' },
  { label: t('tools.og-meta-generator.website.book'), value: 'book' },
  { label: t('tools.og-meta-generator.website.profile'), value: 'profile' },
  {
    type: 'group',
    label: t('tools.og-meta-generator.website.music.label'),
    key: 'Music',
    children: [
      { label: t('tools.og-meta-generator.website.music.song'), value: 'music.song' },
      { label: t('tools.og-meta-generator.website.music.musicAlbum'), value: 'music.album' },
      { label: t('tools.og-meta-generator.website.music.playlist'), value: 'music.playlist' },
      { label: t('tools.og-meta-generator.website.music.radioStation'), value: 'music.radio_station' },
    ],
  },
  {
    type: 'group',
    label: t('tools.og-meta-generator.website.video.label'),
    key: 'Video',
    children: [
      { label: t('tools.og-meta-generator.website.video.movie'), value: 'video.movie' },
      { label: t('tools.og-meta-generator.website.video.episode'), value: 'video.episode' },
      { label: t('tools.og-meta-generator.website.video.tvShow'), value: 'video.tv_show' },
      { label: t('tools.og-meta-generator.website.video.otherVideo'), value: 'video.other' },
    ],
  },
];

export const website: OGSchemaType = {
  name: t('tools.og-meta-generator.website.title'),
  elements: [
    {
      type: 'select',
      label: t('tools.og-meta-generator.website.pageType.label'),
      placeholder: t('tools.og-meta-generator.website.pageType.placeholder'),
      key: 'type',
      options: typeOptions,
    },
    { type: 'input', label: t('tools.og-meta-generator.website.pageTitle.label'), placeholder: t('tools.og-meta-generator.website.pageTitle.placeholder'), key: 'title' },
    {
      type: 'input',
      label: t('tools.og-meta-generator.website.description.label'),
      placeholder: t('tools.og-meta-generator.website.description.placeholder'),
      key: 'description',
    },
    {
      type: 'input',
      label: t('tools.og-meta-generator.website.url.label'),
      placeholder: t('tools.og-meta-generator.website.url.placeholder'),
      key: 'url',
    },
  ],
};
