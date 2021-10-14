import { createRouter, createWebHistory } from 'vue-router'

import Welcome from '~/src/views/screens/welcome.vue'
import Capture from '~/src/views/screens/capture.vue'
import Preview from '~/src/views/screens/preview.vue'
import Download from '~/src/views/screens/download.vue'
const Router = createRouter({
  history: createWebHistory(),
  routes: [
    { name: 'home', path: '/', component: Welcome },
    { name: 'capture', path: '/capture', component: Capture },
    { name: 'preview', path: '/preview', component: Preview },
    { name: 'download', path: '/download', component: Download },
    { path: '/:catchAll(.*)', redirect: { name: 'home' } }
  ]
})
export default Router
