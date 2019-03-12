<template lang="html">
  <div class="capture">
    <div v-if="capturing.status" class="capture-progress">
      <capture-progress></capture-progress>
    </div>
    <capture-options v-else></capture-options>

    <div class="preview">
      <video class="preview-visual" preload="yes" :srcObject.prop="mediaStream" autoplay muted playsinline webkit-playsinline></video>
    </div>

    <button class="capture-btn" :class="{ 'capture-btn--capturing': capturing.status }" @click.prevent="startCapture">Capture</button>

    <encoding-overlay v-if="encoding.status"></encoding-overlay>
  </div>
</template>

<script>
import captureOptions from '/views/components/capture-options'
import captureProgress from '/views/components/capture-progress'
import encodingOverlay from '/views/components/encoding'

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
    }
  }
}
</script>
