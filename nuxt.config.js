import colors from 'vuetify/es5/util/colors'

export default {
  // Enable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: true,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - IT-Tools',
    title: 'IT-Tools',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: 'Aggregated set of useful tools that every developer may need once in a while.'},
      {hid: 'keywords', name: 'keywords', content: ['tools', 'tool', 'it', 'developer', 'web', 'computing']}
    ],
    link: [{rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/vuetify-toast'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/svg',
    'nuxt-i18n'
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: {
      components: [
        'VSnackbar',
        'VBtn',
        'VIcon'
      ]
    },
    theme: {
      dark: true,
      options: {customProperties: true},
      themes: {
        dark: {
          primary: '#05e677',
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          background: '#324148',
          foreground: '#28353b',
          toolbar: '#243137'
        }
      }
    }
  },

  i18n: {
    vueI18nLoader: true,
    locales: ['en'],
    defaultLocale: 'en',
    strategy: 'prefix_and_default'
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},

  router: {
    extendRoutes(routes) {
      routes.forEach((route) => {
        if (route.path.match(/^\/tools\/.*/)) {
          const sections = route.path.split('/')
          route.path = `/${sections[sections.length - 1]}`
          route.meta = {
            isTool: true,
            section: sections[sections.length - 2]
          }
        }
      })
    }
  }
}
