<template>
  <div class="capture">
    <div class="capture-progress" v-if="capturing.status">
      <capture-progress/>
    </div>
    <capture-options v-else/>

    <div class="preview">
      <video class="preview-visual" height="200px"></video>
    </div>

    <button class="capture-btn" :class="{ 'capture-btn--capturing': capturing.status }" @click="startCapture">Capture</button>

  </div>
</template>

<script>
import captureOptions from '@/components/capture-options'
import captureProgress from '@/components/capture-progress'

import { mapState } from 'vuex'

export default {
  name: 'capture',
  components: {
    captureOptions,
    captureProgress
  },
  computed: {
    ...mapState([
      'capturing',
      'timer'
    ])
  },
  methods: {
    startCapture () {
      this.$store.commit('startCapture')
      this.fakeCapture()
    },
    fakeCapture () {
      const interval = (this.timer.selected * 1000) / 100
      const fakeProgress = window.setInterval(() => {
        if (this.capturing.state < 100) {
          this.$store.commit('updateCaptureState', this.capturing.state + 1)
        } else {
          window.clearInterval(fakeProgress)
          this.$store.commit('stopCapture')
        }
      }, interval)
    }
  }
}
</script>
