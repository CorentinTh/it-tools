/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  root: true,
  extends: ['@antfu', './.eslintrc-auto-import.json', '@unocss'],

  rules: {
    'curly': ['error', 'all'],
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/no-use-before-define': ['error', { allowNamedExports: true, functions: false }],
    'vue/no-empty-component-block': ['error'],
    'no-restricted-imports': ['error', {
      paths: [{
        name: '@vueuse/core',
        importNames: ['useClipboard'],
        message: 'Please use local useCopy from src/composable/copy.ts instead of useClipboard.',
      }],
    }],
  },
};
