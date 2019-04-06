import Vue from 'vue'
import Vuex from 'vuex'

import { getCamera } from '/services/camera.js'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    cameraShouldFaceUser: true,
    timer: {
      selected: 2,
      list: [2, 3, 5]
    },
    camera: null,
    capture: null,
    gif: null,
    needRefresh: false
  },
  mutations: {
    updateCameraShouldFaceUser (state, cameraShouldFaceUser) {
      state.cameraShouldFaceUser = cameraShouldFaceUser
    },
    updateTimer (state, time) {
      state.timer.selected = time
    },
    updateCamera (state, camera) {
      if (state.camera) {
        state.camera.mediaStream.getTracks().forEach(track => track.stop())
      }

      state.camera = camera
    },
    updateCapture (state, capture) {
      state.capture = capture
    },
    updateGif (state, gif) {
      state.gif = gif
    },
    updateRefreshBanner (state, value) {
      state.needRefresh = value
    }
  },
  actions: {
    async requestCamera ({ state, commit }, inverseFacingMode) {
      commit('updateCamera', null)

      const shouldFaceUser = inverseFacingMode
        ? !state.cameraShouldFaceUser
        : state.cameraShouldFaceUser

      commit('updateCamera', await getCamera(shouldFaceUser))

      if (inverseFacingMode) {
        commit('updateCameraShouldFaceUser', shouldFaceUser)
      }
    }
  }
})
