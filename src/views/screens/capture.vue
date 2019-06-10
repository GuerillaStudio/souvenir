<template lang="html">
  <layout-default>
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
          <button class="btn btn--danger w100" @click="cancelCountdown">Cancel countdown</button>
        </template>
      </div>
    </div>
  </layout-default>
</template>

<script>
import captureOptions from '/views/components/capture-options'
import captureProgress from '/views/components/capture-progress'
import captureTimer from '/views/components/capture-timer'
import { capture } from '/services/capture.js'
import { countdown } from '/services/countdown.js'

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
    timerProgress: 5,
    countdown: null
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
      if (this.timer > 0) {
        this.runCountdown()
      } else {
        this.runCapture()
      }
    },
    runCountdown () {
      const step = (value) => {
        this.timerProgress = value
      }

      const cleanup = () => {
        this.timerActive = false
        this.timerProgress = 0
        this.countdown = null
      }

      this.timerActive = true
      this.timerProgress = this.timer

      this.countdown = countdown(this.timer, 1000, step).run()

      this.countdown.listen({
        onCancelled: cleanup,
        onRejected: cleanup,
        onResolved: () => {
          cleanup()
          this.runCapture()
        }
      })
    },
    cancelCountdown () {
      if (this.countdown) {
        this.countdown.cancel()
      }
    },
    runCapture () {
      this.capturing = true

      const captureExecution = capture(
        this.camera,
        this.duration.selected * 1000,
        value => {
          this.capturingProgress = value
        }
      ).run()

      const cleanup = () => {
        this.capturing = false
        this.capturingProgress = 0
      }

      captureExecution.listen({
        onCancelled: cleanup,
        onRejected: cleanup,
        onResolved: (captureData) => {
          cleanup()
          this.$store.commit('updateCapture', captureData)
          this.$router.push({ name: 'preview' })
        }
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
