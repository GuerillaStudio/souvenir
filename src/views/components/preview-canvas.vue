<template>
  <canvas ref="previewCanvas"></canvas>
</template>

<script>
import { mapState } from 'vuex'
import { boomerang } from '/services/effects.js'
import { pipe, cycle } from '/services/util.js'

export default {
  name: 'previewCanvas',
  data: () => ({
    previewInterval: null
  }),
  computed: {
    ...mapState([
      'capture',
      'boomerang'
    ])
  },
  methods: {
    startPreview () {
      if (!this.capture) {
        this.backHome()
      } else {
        const canvas = this.$refs.previewCanvas
        canvas.width = this.capture.imageWidth
        canvas.height = this.capture.imageHeight
        const canvasContext = canvas.getContext('2d')

        const imagesIterator = pipe(this.capture.imageDataList, [
          (images) => this.boomerang ? boomerang(images) : images,
          cycle
        ])
        const delay = this.capture.delayTime

        this.previewInterval = setInterval(() => {
          const {
            value: image,
            done
          } = imagesIterator.next()

          if (image) {
            canvasContext.putImageData(image, 0, 0)
          }

          if (done) {
            clearInterval(this.previewInterval)
            this.previewInterval = null
          }
        }, delay)
      }
    },
    stopPreview () {
      window.clearInterval(this.previewInterval)
    }
  },
  watch: {
    boomerang: function () {
      this.stopPreview()
      this.startPreview()
    }
  },
  mounted () {
    this.startPreview()
  },
  destroyed () {
    this.stopPreview()
  }
}
</script>
