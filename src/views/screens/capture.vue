<template lang="html">
  <div class="capture">
    <div v-if="capturing" class="capture-progress">
      <capture-progress :value="capturingProgress"></capture-progress>
    </div>
    <capture-options v-else></capture-options>

    <div class="preview">
      <video ref="preview" class="preview-visual" :class="{ 'preview--flip': shouldFlip }" preload="yes" autoplay muted playsinline webkit-playsinline></video>
      <capture-timer v-if="timerActive" :time="timerProgress"></capture-timer>
    </div>

    <div class="capture-actions">
      <template v-if="!timerActive">
        <button class="capture-btn" :class="{ 'capture-btn--capturing': capturing }" :disabled="!camera" @click.prevent="startCapturing">Capture</button>
        <button class="capture-switch" title="Switch camera" @click="switchCamera"><icon-switch></icon-switch></button>
      </template>
      <template v-else>
        <button class="btn btn--danger w100">Cancel countdown</button>
      </template>
    </div>

  </div>
</template>

<script>
import captureOptions from '/views/components/capture-options'
import captureProgress from '/views/components/capture-progress'
import captureTimer from '/views/components/capture-timer'
import { capture } from '/services/capture.js'

import 'objectFitPolyfill'

import { mapState } from 'vuex'

import iconSwitch from '/views/icons/ico-switch'

export default {
  name: 'capture',
  components: {
    captureOptions,
    captureProgress,
    captureTimer,
    iconSwitch
  },
  data: () => ({
    capturing: false,
    capturingProgress: 0,
    timerActive: false,
    timerProgress: 5
  }),
  computed: {
    ...mapState([
      'camera',
      'duration',
      'capture',
      'timer'
    ]),
    shouldFlip () {
      if (this.camera) {
        switch (this.camera.facingMode) {
          default:
            throw new Error('Unhandled case')

          case 'user':
          case 'unknow':
            return true

          case 'environment':
            return false
        }
      } else {
        return false
      }
    }
  },
  methods: {
    switchCamera () {
      this.$store.dispatch('requestCamera', true)
    },
    startCapturing () {
      this.capturing = true
      const capturing = capture(this.camera, this.duration.selected * 1000)

      capturing.once('error', error => {
        console.error(error)
        this.capturing = false
        this.capturingProgress = 0
      })

      capturing.on('progress', value => {
        this.capturingProgress = value
      })

      capturing.once('done', captureData => {
        this.capturing = false
        this.capturingProgress = 0
        this.$store.commit('updateCapture', captureData)
        this.$router.push({ name: 'preview' })
      })
    },
    async ensureCamera () {
      if (!this.camera) {
        try {
          await this.$store.dispatch('requestCamera', false)
        } catch (error) {
          console.error(error)
          window.alert('You haven\'t allowed to use your camera.\n\nOr maybe your browser is not compatible :(')
          this.$router.push({ name: 'home' })
        }
      }
    },
    updatePreviewMediaStream () {
      const mediaStream = this.camera ? this.camera.mediaStream : null
      this.$refs.preview.srcObject = mediaStream
    },
    handleVisibilityChange (event) {
      if (!document.hidden) {
        this.ensureCamera()
      }
    }
  },
  watch: {
    camera: function () {
      this.updatePreviewMediaStream()
    }
  },
  mounted: function () {
    this.updatePreviewMediaStream()
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
    document.body.classList.add('capture-body')
    window.objectFitPolyfill(this.$refs.preview)

    this.ensureCamera()
  },
  destroyed: function () {
    document.body.classList.remove('capture-body')
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
  }
}
</script>
