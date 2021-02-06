module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {
    'space-before-function-paren': 'off',
    'object-curly-spacing': 'off',
    'no-undef': 'off' // will be catch by the tsc compiler
  }
}
