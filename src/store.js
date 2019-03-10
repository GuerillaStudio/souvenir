import Vue from 'vue'
import Vuex from 'vuex'

import { capture } from '@/services/capture.js'
import { encode } from '@/services/encode.js'

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
      status: false,
      dataUrl: null,
      timestamp: null
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
    startDownloading (store, dataUrl) {
      store.downloading.status = true
      store.downloading.dataUrl = dataUrl
      store.downloading.timestamp = Date.now()
    },
    stopDownloading (store) {
      store.downloading.status = false
      store.downloading.dataUrl = null
      store.downloading.timestamp = null
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
        .then(dataUrl => {
          commit('stopEncoding')
          commit('startDownloading', dataUrl)
        })
        .catch(error => console.error(error))
    }
  }
})
