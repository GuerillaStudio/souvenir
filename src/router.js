import Vue from 'vue'
import VueRouter from 'vue-router'

import Welcome from '/views/screens/welcome'
import Capture from '/views/screens/capture'
import Download from '/views/screens/download'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    { name: 'home', path: '/', component: Welcome },
    { name: 'capture', path: '/capture', component: Capture },
    { name: 'download', path: '/download', component: Download }
  ]
})
