import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import router from "../router";

if(process.env.VUE_APP_GANALYTICS){
    Vue.use(VueAnalytics, {
        id: process.env.VUE_APP_GANALYTICS,
        router,
        set:[
            {
                field: 'dimension1',
                value: process.env.APPLICATION_VERSION
            }
        ]
    })
}
