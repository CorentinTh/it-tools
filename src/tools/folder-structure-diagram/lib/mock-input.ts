// not using a template string in order
// to have more control over whitespace
export const mockInput = [
  'my-app',
  '  src',
  '    index.html',
  '    main.ts',
  '   main.scss',
  '  - build',
  '    - index.html',
  '    main.js',
  '    main.css',
  '',
  '  ',
  '  .prettierrc.json',
  '  .gitlab-ci.yml',
  '  README.md',
  'empty dir',
].join('\n');
