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
      status: false,
      state: 0
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
    inverseFacingMode (state) {
      state.capturing.shouldFaceUser = !state.capturing.shouldFaceUser
    },
    updateTimer (state, time) {
      state.timer.selected = time
    },
    startCapture (state) {
      state.capturing.status = true
    },
    stopCapture (state) {
      state.capturing.status = false
    },
    updateCaptureState (state, percent) {
      state.capturing.state = percent
    },
    startEncoding (state) {
      state.encoding.status = true
    },
    stopEncoding (state) {
      state.encoding.status = false
    },
    updateEncodingState (state, percent) {
      state.encoding.state = percent
    },
    startDownloading (state, objectUrl) {
      state.downloading.status = true
      state.downloading.objectUrl = objectUrl
      state.downloading.timestamp = Date.now()
    },
    stopDownloading (state) {
      if (state.downloading.objectUrl) {
        URL.revokeObjectURL(state.downloading.objectUrl)
      }

      state.downloading.status = false
      state.downloading.objectUrl = null
      state.downloading.timestamp = null
    }
  },
  actions: {
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
    capture ({ state, commit, dispatch }) {
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

      encoding.on('progress', value => commit('updateEncodingState', Math.round(value * 100)))

      encoding.once('done', objectUrl => {
        commit('stopEncoding')
        commit('updateEncodingState', 0)
        commit('startDownloading', objectUrl)
      })
    }
  }
})
