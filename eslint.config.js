import antfu from '@antfu/eslint-config';
import unocss from '@unocss/eslint-config/flat';
import autoImport from './.eslintrc-auto-import.json' with { type: 'json' };

export default antfu(
  {
    vue: true,
    typescript: true,
    stylistic: {
      semi: true,
    },
  },
  unocss,
  {
    languageOptions: {
      globals: autoImport.globals,
    },
  },
  {
    rules: {
      'curly': ['error', 'all'],
      // Keep the code style of @antfu/eslint-config 0.41: no delimiters after multiline type members,
      // and no forced line breaks between list items.
      'style/member-delimiter-style': ['error', { multiline: { delimiter: 'none' }, singleline: { delimiter: 'semi' } }],
      'antfu/reasonable-newline': 'off',
      'ts/no-use-before-define': ['error', { allowNamedExports: true, functions: false }],
      'vue/no-empty-component-block': ['error'],
      'no-restricted-imports': ['error', {
        paths: [{
          name: '@vueuse/core',
          importNames: ['useClipboard'],
          message: 'Please use local useCopy from src/composable/copy.ts instead of useClipboard.',
        }],
      }],
    },
  },
  {
    // Playwright locators have an innerText() method, which the rule mistakes for the DOM property.
    files: ['**/*.e2e.spec.ts'],
    rules: {
      'unicorn/prefer-dom-node-text-content': 'off',
    },
  },
);
