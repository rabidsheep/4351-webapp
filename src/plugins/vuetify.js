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
    theme: {
      disable: true,
      /*dark: true,
      options: {customProperties: true},
      themes: {
        dark: {
            background: '#3a3939',
            text: '#ffffff',
            text2: '#000000',
            accent: '#b21d45',
            accent2: '#eed1e4',
            button: '#847676',
            primary: '#ffffff',
            success: '#4CAF50',
            info: '#2196F3',
            warning: '#FB8C00',
            error: '#FF5252',
        }
      }*/
    }
  });