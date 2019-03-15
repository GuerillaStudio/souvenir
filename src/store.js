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
    updateWelcomed (state, welcome) {
      state.welcomed = welcome
    },
    startCamera (state, mediaStream) {
      state.mediaStream = mediaStream
    },
    stopCamera (state) {
      if (state.mediaStream) {
        state.mediaStream.getTracks().forEach(track => track.stop())
      }

      state.mediaStream = null
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
      commit('updateWelcomed', true)
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
        .catch(error => {
          console.error(error)
          window.alert('You haven\'t allowed to use your camera.\n\nOr maybe your browser is not compatible :(')
          commit('updateWelcomed', false)
        })
    },
    capture ({ commit, dispatch, state }) {
      commit('startCapture')
      const capturing = capture(state.mediaStream, state.timer.selected * 1000)

      capturing.once('error', error => console.error(error))

      capturing.on('progress', value => commit('updateCaptureState', Math.round(value * 100)))

      capturing.once('done', captureData => {
        commit('stopCapture')
        commit('updateCaptureState', 0)
        dispatch('encode', captureData)
      })
    },
    encode ({ commit }, captureData) {
      commit('startEncoding')
      const encoding = encode(captureData)

      encoding.once('error', error => console.error(error))

      encoding.on('progress', value => console.log(`Encoding progress ${Math.round(value * 100)}% (${value})`))

      encoding.once('done', objectUrl => {
        commit('stopEncoding')
        commit('startDownloading', objectUrl)
      })
    }
  }
})
