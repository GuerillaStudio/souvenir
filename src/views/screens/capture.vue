<template lang="html">
  <div class="capture">
    <div v-if="capturing.status" class="capture-progress">
      <capture-progress></capture-progress>
    </div>
    <capture-options v-else></capture-options>

    <div class="preview">
      <video ref="preview" class="preview-visual" :class="{ 'preview--flip': flipActive }" preload="yes" autoplay muted playsinline webkit-playsinline></video>
    </div>

    <button class="capture-btn" :class="{ 'capture-btn--capturing': capturing.status }" :disabled="!mediaStream" @click.prevent="startCapture">Capture</button>

    <encoding-overlay v-if="encoding.status"></encoding-overlay>
  </div>
</template>

<script>
import captureOptions from '/views/components/capture-options'
import captureProgress from '/views/components/capture-progress'
import encodingOverlay from '/views/components/encoding'

import 'objectFitPolyfill'

import { mapState } from 'vuex'

export default {
  name: 'capture',
  components: {
    captureOptions,
    captureProgress,
    encodingOverlay
  },
  computed: {
    ...mapState([
      'mediaStream',
      'facingMode',
      'capturing',
      'timer',
      'encoding'
    ]),
    flipActive () {
      return this.facingMode === 'user' || this.facingMode === 'unknow'
    }
  },
  methods: {
    async startCapture () {
      const captureData = await this.$store.dispatch('capture')
      await this.$store.dispatch('encode', captureData)
      this.$router.push({ name: 'download' })
    },
    async ensureCameraStarted () {
      if (!this.mediaStream) {
        try {
          await this.$store.dispatch('requestCamera', false)
        } catch (error) {
          console.error(error)
          window.alert('You haven\'t allowed to use your camera.\n\nOr maybe your browser is not compatible :(')
          this.$router.push({ name: 'home' })
        }
      }
    },
    handleVisibilityChange (event) {
      if (!document.hidden) {
        this.ensureCameraStarted()
      }
    },
    updatePreviewMediaStream () {
      this.$refs.preview.srcObject = this.mediaStream
    }
  },
  watch: {
    mediaStream: function (mediaStream) {
      this.updatePreviewMediaStream()
    }
  },
  mounted: function () {
    this.updatePreviewMediaStream()
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
    document.body.classList.add('capture-body')
    window.objectFitPolyfill(this.$refs.preview)

    this.ensureCameraStarted()
  },
  updated: function () {
    this.updatePreviewMediaStream()
  },
  destroyed: function () {
    document.body.classList.remove('capture-body')
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
  }
}
</script>
