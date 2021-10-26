import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.min.css' // Ensure you are using css-loader
Vue.use(Vuetify)

export default new Vuetify({
    rtl: false,
    icons: {
      iconfont: 'mdi'
    },
    breakpoint: {
      thresholds: {
        xxs: 450,
        xs: 650,
        sm: 800,
        md: 900,
        lg: 1280,
      },
      mobileBreakpoint: 740,
    },
    theme: { disable: true, }
  });