import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify.js';
import router from './router.js';
import './plugins/globals.js';
import Vuelidate from "vuelidate";

Vue.use(Vuelidate);
Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  render: h => h(App),
}).$mount('#app')
