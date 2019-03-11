<template>
  <div class="capture">
    <div class="capture-progress" v-if="capturing.status">
      <capture-progress/>
    </div>
    <capture-options v-else/>

    <div class="preview" ref="previewcontainer">
      <video ref="preview" class="preview-visual" preload="yes" autoplay muted playsinline webkit-playsinline></video>
    </div>

    <button class="capture-btn" :class="{ 'capture-btn--capturing': capturing.status }" @click.prevent="startCapture">Capture</button>

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
  data () {
    return {
      loadListener: null,
      resizeListener: null
    }
  },
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
    getpreviewcontainerSquare () {
      this.$refs.previewcontainer.style.height = this.$refs.previewcontainer.getBoundingClientRect().width + 'px'
    },
    applyScaling () {
      const containerRect = this.$refs.previewcontainer.getBoundingClientRect()
      const { left, top, width, height } = this.calcImageDimens(
        containerRect.width,
        containerRect.height,
        this.$refs.preview.videoWidth,
        this.$refs.preview.videoHeight
      )

      this.$refs.preview.style.left = `${left}px`
      this.$refs.preview.style.top = `${top}px`
      this.$refs.preview.style.width = `${width}px`
      this.$refs.preview.style.height = `${height}px`
    },
    calcImageDimens (targetWidth, targetHeight, sourceWidth, sourceHeight) {
      let left = 0
      let top = 0
      let width = targetWidth
      let height = targetHeight

      const targetAspect = width / height
      const actualAspect = sourceWidth / sourceHeight

      if (targetAspect > actualAspect) {
        // cut off the top/bottom
        height = Math.round(width / actualAspect)
      } else {
        // cut off the left/right
        width = Math.round(height * actualAspect)
      }

      left = -Math.floor((width - targetWidth) / 2)
      top = -Math.floor((height - targetHeight) / 2)

      return { left, top, width, height }
    }

  },
  mounted: function () {
    this.$refs.preview.srcObject = this.mediaStream
    this.getpreviewcontainerSquare()

    // On load
    this.loadListener = this.$refs.preview.addEventListener('resize', () => {
      this.applyScaling()
    }, false)
    // On window resize
    this.resizeListener = window.addEventListener('resize', () => {
      this.getpreviewcontainerSquare()
      this.applyScaling()
    }, false)
  },
  destroyed: function () {
    this.loadListener = null
    this.resizeListener = null
  }
}
</script>
