import Vue from 'vue';
import Vuetify, { VSnackbar, VBtn, VIcon } from 'vuetify/lib'

Vue.use(Vuetify, {
  components: {
    VSnackbar,
    VBtn,
    VIcon
  }
})
export default new Vuetify({
  theme: {
    themes: {
      theme: 'dark',
      dark: {
        primary: '#4CAF50',
        secondary: '#424242',
        accent: '#4CAF50',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
      },
    },
  },
  icons: {
    iconfont: 'fa',
  },
});
