import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import registerServiceWorker from './register-service-worker.js'

import LayoutDefault from '~/src/views/layout/default.vue'
import LayoutOverlay from '~/src/views/layout/overlay.vue'

createApp(App)
  .use(store)
  .use(router)
  .component('layout-default', LayoutDefault)
  .component('layout-overlay', LayoutOverlay)
  .mount('#app')

registerServiceWorker()

console.log(`%c
  ┌─┐┌─┐┬ ┬┬  ┬┌─┐┌┐┌┬┬─┐
  └─┐│ ││ │└┐┌┘├┤ ││││├┬┘
  └─┘└─┘└─┘ └┘ └─┘┘└┘┴┴└─

  Oh hi! If you're looking for the source code, It's here: https://github.com/GlitchFamily/souvenir

  Have fun 💜

`, 'font-family:monospace')
