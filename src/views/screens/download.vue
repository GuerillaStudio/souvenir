<template lang="html">
  <layout-overlay :close="back">
    <encoding-screen v-if="encoding" :value="encodingProgress"></encoding-screen>
    <div v-if="gif" class="download">
      <div class="download-preview">
        <img class="download-preview__visual" :src="objectUrl" alt="">
        <illu-flower class="download-preview__flower"></illu-flower>
      </div>
      <div class="layoutOverlay-content">
        <div class="layoutOverlay-title">Ready just for you~</div>
        <div class="layoutOverlay-subtitle">
          Thank you for your patience.<br>
          You can now download your souvenir.
        </div>
      </div>
      <a class="download-btn btn btn--primary w100" :href="objectUrl" :download="`souvenir${timestamp}.gif`"><icon-dl></icon-dl>Save as GIF</a>
    </div>
  </layout-overlay>
</template>

<script>
import { mapState } from 'vuex'
import { encode } from '/services/encode.js'
import encodingScreen from '/views/screens/encoding'
import iconDl from '/views/icons/ico-download'
import illuFlower from '/views/icons/flower'

export default {
  name: 'download',
  components: {
    encodingScreen,
    iconDl,
    illuFlower
  },
  data: () => ({
    encoding: false,
    encodingProgress: 0,
    objectUrl: null,
    downloadReady: false
  }),
  computed: {
    ...mapState([
      'capture',
      'boomerang',
      'gif'
    ]),
    timestamp () {
      if (this.gif) {
        return this.gif.createdAt.getTime()
      }
      return null
    }
  },
  methods: {
    back () {
      this.$router.push({ name: 'preview' })
    },
    backHome () {
      this.$router.push({ name: 'home' })
    },
    fillGIF () {
      this.objectUrl = URL.createObjectURL(this.gif.blob)
    },
    emptyGIF () {
      URL.revokeObjectURL(this.objectUrl)
      this.$store.commit('updateGif', null)
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
        this.fillGIF()
        this.downloadReady = true
      })
    }
  },
  created () {
    if (!this.capture) {
      this.$router.push({ name: 'home' })
    } else if (!this.gif) {
      this.startEncoding()
    } else {
      this.fillGIF()
    }
  },
  destroyed () {
    this.emptyGIF()
  }
}
</script>
