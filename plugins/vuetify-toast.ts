import Vue from 'vue'
import VuetifyToast from 'vuetify-toast-snackbar'

// @ts-ignore
export default ({ $vuetify }) => {
  Vue.use(VuetifyToast, {
    $vuetify
  })
}
