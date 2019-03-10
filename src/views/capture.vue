<template>
  <div class="capture">
    <div class="capture-progress" v-if="capturing.status">
      <capture-progress/>
    </div>
    <capture-options v-else/>

    <div class="preview">
      <video ref="preview" class="preview-visual" height="200px" preload="yes" autoplay muted playsinline webkit-playsinline></video>
    </div>

    <button class="capture-btn" :class="{ 'capture-btn--capturing': capturing.status }" @click="startCapture">Capture</button>

    <encoding-overlay v-if="encoding.status"/>
  </div>
</template>

<script>
import captureOptions from '@/components/capture-options'
import captureProgress from '@/components/capture-progress'
import encodingOverlay from '@/components/encoding'

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
  },
  mounted: function () {
    this.$refs.preview.srcObject = this.mediaStream
  }
}
</script>
