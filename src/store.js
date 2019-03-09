import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    welcomed: false,
    timer: {
      selected: 2,
      list: [2, 3, 5]
    }
  },
  mutations: {
    welcome (store, value) {
      store.welcomed = value
    },
    updateTimer (store, time) {
      store.timer.selected = time
    }
  },
  actions: {

  }
})
