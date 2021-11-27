import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Reserve from './views/Reserve.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/reserve',
      name: 'reserve',
      component: Reserve,
      props: {
        userDetails: Object,
      }
    }
  ]
})