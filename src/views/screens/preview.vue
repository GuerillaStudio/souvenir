<template lang="html">
  <div class="download">
    <capture-options :disabled-time="true" :disabled-timer="true" :back-btn="back"></capture-options>

    <div class="preview">
      <preview-canvas v-if="capture" class="preview-visual"></preview-canvas>
    </div>

    <button class="download-btn btn btn--primary w100" :class="{ 'btn--loading': encoding }" :disabled="encoding" @click="startEncoding">Generate GIF</button>

    <encoding-overlay v-if="encoding" :value="encodingProgress"></encoding-overlay>
  </div>
</template>

<script>
import { encode } from '/services/encode.js'
import encodingOverlay from '/views/components/encoding'
import captureOptions from '/views/components/capture-options'
import previewCanvas from '/views/components/preview-canvas'

import { mapState } from 'vuex'

export default {
  name: 'preview',
  components: {
    encodingOverlay,
    captureOptions,
    previewCanvas
  },
  data: () => ({
    encoding: false,
    encodingProgress: 0,
    previewInterval: null
  }),
  computed: {
    ...mapState([
      'camera',
      'capture',
      'boomerang'
    ])
  },
  methods: {
    back () {
      this.$router.push({ name: 'capture' })
    },
    backHome () {
      this.$router.push({ name: 'home' })
    },
    startEncoding () {
      this.encoding = true
      const encoding = encode(this.capture, { boomerangEffect: this.boomerang })

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
  }
}
</script>
