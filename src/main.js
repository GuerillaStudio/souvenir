import Vue from 'vue'
import App from '/App.vue'
import router from '/router'
import store from '/store'

import registerServiceWorker from '/register-service-worker.js'

import LayoutDefault from '/views/layout/default'
Vue.component('layout-default', LayoutDefault)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

registerServiceWorker()
