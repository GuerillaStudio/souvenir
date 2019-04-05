<template lang="html">
  <div class="capture">
    <div v-if="capturing" class="capture-progress">
      <capture-progress :value="capturingProgress"></capture-progress>
    </div>
    <capture-options v-else></capture-options>

    <div class="preview">
      <video ref="preview" class="preview-visual" :class="{ 'preview--flip': shouldFlip }" preload="yes" autoplay muted playsinline webkit-playsinline></video>
    </div>

    <button class="capture-btn" :class="{ 'capture-btn--capturing': capturing }" :disabled="!camera || encoding" @click.prevent="startCapturing">Capture</button>

    <encoding-overlay v-if="encoding" :value="encodingProgress"></encoding-overlay>
  </div>
</template>

<script>
import captureOptions from '/views/components/capture-options'
import captureProgress from '/views/components/capture-progress'
import encodingOverlay from '/views/components/encoding'
import { capture } from '/services/capture.js'
import { encode } from '/services/encode.js'

import 'objectFitPolyfill'

import { mapState } from 'vuex'

export default {
  name: 'capture',
  components: {
    captureOptions,
    captureProgress,
    encodingOverlay
  },
  data: () => ({
    capturing: false,
    capturingProgress: 0,
    encoding: false,
    encodingProgress: 0
  }),
  computed: {
    ...mapState([
      'camera',
      'timer',
      'capture'
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
    startCapturing () {
      this.capturing = true
      const capturing = capture(this.camera, this.timer.selected * 1000)

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
        this.startEncoding()
      })
    },
    startEncoding () {
      this.encoding = true
      const encoding = encode(this.capture)

      encoding.once('error', error => {
        console.error(error)
        this.encoding = false
        this.encodingProgress = 0
      })

      encoding.on('progress', value => {
        this.encodingProgress = value
      })

      encoding.once('done', gif => {
        this.encoding = false
        this.encodingProgress = 0
        this.$store.commit('updateGif', gif)
        this.$router.push({ name: 'download' })
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
