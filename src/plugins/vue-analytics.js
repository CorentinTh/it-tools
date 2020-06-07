import Vue from 'vue'
import VueAnalytics from 'vue-analytics'

if(process.env.VUE_APP_GANALYTICS){
    Vue.use(VueAnalytics, {
        id: process.env.VUE_APP_GANALYTICS
    })
}
