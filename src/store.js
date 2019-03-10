import Vue from 'vue'
import Vuex from 'vuex'

import { capture } from './services/capture.js'
import { encode } from './services/encode.js'

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
    updateMediaStream (store, mediaStream) {
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
    },
    capture ({ commit, dispatch, state }) {
      commit('startCapture')

      capture(commit, state.mediaStream, state.timer.selected * 1000)
        .then(captureData => {
          commit('stopCapture')
          commit('updateCaptureState', 0)
          dispatch('encode', captureData)
        })
        .catch(error => console.error(error))
    },
    encode ({ commit }, captureData) {
      commit('startEncoding')

      console.log(captureData)

      encode(captureData)
        .then(clipDataUrl => {
          commit('stopEncoding')
          commit('startDownloading')
          console.log(clipDataUrl)
        })
        .catch(error => {
          console.error(error)
          commit('stopEncoding')
          commit('startDownloading')
        })
    }
  }
})
