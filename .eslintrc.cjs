/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', 'plugin:vue/vue3-recommended', '@vue/eslint-config-typescript/recommended'],
  env: {
    'vue/setup-compiler-macros': true,
  },
  rules: {
    'vue/multi-word-component-names': ['off'],
  },
};
