import type { OGSchemaType } from '../OGSchemaType.type';

export const videoMovie: OGSchemaType = {
  name: 'Movie details',
  elements: [
    {
      type: 'input-multiple',
      label: 'Actor',
      key: 'video:actor',
      placeholder: 'Name of the actress/actor...',
    },
    // { type: 'input', label: 'Actor role', key: 'video:actor:role', placeholder: 'The role they played...' },
    {
      type: 'input-multiple',
      label: 'Director',
      key: 'video:director',
      placeholder: 'Name of the director...',
    },
    { type: 'input-multiple', label: 'Writer', key: 'video:writer', placeholder: 'Writers of the movie...' },
    { type: 'input', label: 'Duration', key: 'video:duration', placeholder: 'The movie\'s length in seconds...' },
    {
      type: 'input',
      label: 'Release date',
      key: 'video:release_date',
      placeholder: 'The date the movie was released...',
    },
    { type: 'input', label: 'Tag', key: 'video:tag', placeholder: 'Tag words associated with this movie...' },
  ],
};
