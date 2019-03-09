import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    welcomed: false,
    timer: {
      selected: 2,
      list: [2, 3, 5]
    },
    capturing: {
      status: false,
      state: 0
    },
    encoding: {
      status: false
    }
  },
  mutations: {
    welcome (store, value) {
      store.welcomed = value
    },
    updateTimer (store, time) {
      store.timer.selected = time
    },
    startCapture (store) {
      store.capturing.status = true
    },
    stopCapture (store) {
      store.capturing.status = false
    },
    updateCaptureState (store, percent) {
      store.capturing.state = percent
    },
    startEncoding (store) {
      store.encoding.status = true
    },
    stopEncoding (store) {
      store.encoding.status = false
    }
  },
  actions: {

  }
})
