import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mediaStream: null,
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
    },
    downloading: {
      status: false
    }
  },
  mutations: {
    updateMediaStream(store, mediaStream) {
      if (store.mediaStream) {
        store.mediaStream.getTracks().forEach(track => track.stop())
      }

      store.mediaStream = mediaStream
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
    },
    startDownloading (store) {
      store.downloading.status = true
    },
    stopDownloading (store) {
      store.downloading.status = false
    }
  },
  actions: {
    requestCamera ({ commit }) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(mediaStream => {
          commit('updateMediaStream', mediaStream)
        })
        .catch(error => console.error(error))
    }
  }
})
