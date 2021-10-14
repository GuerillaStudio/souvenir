import { createStore } from 'vuex'
import { getCamera } from '~/src/services/camera.js'

export default createStore({
  strict: process.env.NODE_ENV !== 'production',
  state () {
    return {
      cameraShouldFaceUser: true,
      duration: {
        selected: 2,
        list: [2, 3, 5]
      },
      boomerang: false,
      timer: 0,
      camera: null,
      capture: null,
      gif: null,
      needRefresh: false
    }
  },
  mutations: {
    updateCameraShouldFaceUser (state, cameraShouldFaceUser) {
      state.cameraShouldFaceUser = cameraShouldFaceUser
    },
    updateDuration (state, time) {
      state.duration.selected = time
    },
    updateBoomerang (state, value) {
      state.boomerang = value
    },
    updateTimer (state, value) {
      state.timer = value
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
