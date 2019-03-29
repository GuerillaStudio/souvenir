<template lang="html">
  <div class="download">
    <div class="options">
      <span></span>
      <button class="options__btn" @click="back">← back</button>
    </div>

    <div class="preview">
      <canvas ref="previewCanvas" class="preview-visual"></canvas>
    </div>

    <button class="download-btn btn btn--primary w100" :class="{ 'btn--loading': encoding }" :disabled="encoding" @click="startEncoding">Generate GIF</button>

    <encoding-overlay v-if="encoding" :value="encodingProgress"></encoding-overlay>
  </div>
</template>

<script>
import { encode } from '/services/encode.js'
import encodingOverlay from '/views/components/encoding'
import { cycle } from '/services/util.js'

import { mapState } from 'vuex'

export default {
  name: 'preview',
  components: {
    encodingOverlay
  },
  data: () => ({
    encoding: false,
    encodingProgress: 0,
    previewInterval: null
  }),
  computed: {
    ...mapState([
      'camera',
      'capture'
    ])
  },
  methods: {
    back () {
      this.$router.push({ name: 'capture' })
    },
    backHome () {
      this.$router.push({ name: 'home' })
    },
    startPreview () {
      if (!this.capture) {
        this.backHome()
      } else {
        const canvas = this.$refs.previewCanvas
        canvas.width = this.capture.imageWidth
        canvas.height = this.capture.imageHeight
        const canvasContext = canvas.getContext('2d')

        const imagesIterator = cycle(this.capture.imageDataList)
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
    startEncoding () {
      this.encoding = true
      const encoding = encode(this.capture, { boomerangEffect: false })

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
    }
  },
  created () {
    if (!this.capture) {
      this.backHome()
    }
  },
  mounted () {
    this.startPreview()
  },
  destroyed () {
    window.clearInterval(this.previewInterval)
  }
}
</script>
