import Vue from 'vue'
import Vuex from 'vuex'

import { capture } from '/services/capture.js'
import { encode } from '/services/encode.js'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    welcomed: false,
    mediaStream: null,
    timer: {
      selected: 2,
      list: [2, 3, 5]
    },
    capturing: {
      status: false,
      shouldFaceUser: true,
      state: 0
    },
    encoding: {
      status: false
    },
    downloading: {
      status: false,
      objectUrl: null,
      timestamp: null
    }
  },
  mutations: {
    welcome (state) {
      state.welcomed = true;
    },
    startCamera (state, mediaStream) {
      state.mediaStream = mediaStream
    },
    stopCamera (state) {
      if (state.mediaStream) {
        state.mediaStream.getTracks().forEach(track => track.stop())
      }
    },
    inverseFacingMode (store) {
      store.capturing.shouldFaceUser = !store.capturing.shouldFaceUser
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
    startDownloading (store, objectUrl) {
      store.downloading.status = true
      store.downloading.objectUrl = objectUrl
      store.downloading.timestamp = Date.now()
    },
    stopDownloading (store) {
      if (store.downloading.objectUrl) {
        URL.revokeObjectURL(store.downloading.objectUrl)
      }

      store.downloading.status = false
      store.downloading.objectUrl = null
      store.downloading.timestamp = null
    }
  },
  actions: {
    welcome ({ commit, dispatch }) {
      commit('welcome')
      dispatch('requestCamera', false)
    },
    requestCamera ({ state, commit }, inverseFacingMode) {
      const shouldFaceUser = inverseFacingMode
        ? !state.capturing.shouldFaceUser
        : state.capturing.shouldFaceUser

      const constraints = {
        video: {
          facingMode: shouldFaceUser ? 'user' : 'environment'
        },
        audio: false
      }

      commit('stopCamera')

      navigator.mediaDevices.getUserMedia(constraints)
        .then(mediaStream => {
          commit('startCamera', mediaStream)

          if (inverseFacingMode) {
            commit('inverseFacingMode')
          }
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
