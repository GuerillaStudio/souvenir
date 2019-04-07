import Vue from 'vue'
import VueRouter from 'vue-router'

import Welcome from '/views/screens/welcome'
import Capture from '/views/screens/capture'
import Preview from '/views/screens/preview'
import Download from '/views/screens/download'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes: [
    { name: 'home', path: '/', component: Welcome },
    { name: 'capture', path: '/capture', component: Capture },
    { name: 'preview', path: '/preview', component: Preview },
    { name: 'download', path: '/download', component: Download },
    { path: '*', redirect: { name: 'home' } }
  ]
})
