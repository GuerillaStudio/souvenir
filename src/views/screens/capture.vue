<template lang="html">
  <div class="capture">
    <div v-if="capturing.status" class="capture-progress">
      <capture-progress></capture-progress>
    </div>
    <capture-options v-else></capture-options>

    <div class="preview">
      <video ref="preview" class="preview-visual" preload="yes" autoplay muted playsinline webkit-playsinline></video>
    </div>

    <button class="capture-btn" :class="{ 'capture-btn--capturing': capturing.status }" @click.prevent="startCapture" :disabled="!mediaStream">Capture</button>

    <encoding-overlay v-if="encoding.status"></encoding-overlay>
  </div>
</template>

<script>
import captureOptions from '/views/components/capture-options'
import captureProgress from '/views/components/capture-progress'
import encodingOverlay from '/views/components/encoding'

import objectFitPolyfill from 'objectFitPolyfill'

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
      'capturing',
      'timer',
      'encoding'
    ])
  },
  methods: {
    startCapture () {
      this.$store.dispatch('capture')
    },
    updatePreviewMediaStream() {
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
    window.objectFitPolyfill(this.$refs.preview)
    document.body.classList.add('capture-body')
  },
  updated: function () {
    this.updatePreviewMediaStream()
  },
  destroyed: function () {
    document.body.classList.remove('capture-body')
  }
}
</script>
