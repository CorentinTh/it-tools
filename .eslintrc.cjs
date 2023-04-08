/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier',
    'plugin:import/recommended',
    './.eslintrc-auto-import.json',
    '@unocss',
  ],

  settings: {
    'import/resolver': { typescript: { project: './tsconfig.app.json' } },
  },
  env: {
    'vue/setup-compiler-macros': true,
  },
  rules: {
    'vue/multi-word-component-names': ['off'],
    'prettier/prettier': ['error'],
    'import/no-duplicates': ['error', { considerQueryString: true }],
    'import/order': ['error', { groups: [['builtin', 'external', 'internal']] }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-unresolved': ['error', { ignore: ['^virtual:'] }],
  },
};
