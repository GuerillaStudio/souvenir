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
import { encode } from '~/src/services/encode.js'
import encodingScreen from '~/src/views/screens/encoding.vue'
import iconDl from '~/src/views/icons/ico-download.vue'
import illuFlower from '~/src/views/icons/flower.vue'
import appLogo from '~/src/assets/img/icons/android-chrome-512x512.png'

export default {
  name: 'download',
  components: {
    encodingScreen,
    iconDl,
    illuFlower
  },
  data: () => ({
    encoding: false,
    encodingExecution: null,
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
      this.cancelEncode()
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
    startEncode () {
      this.encoding = true
      this.encodingProgress = 0

      this.encodingExecution = encode(
        this.capture,
        { boomerangEffect: this.boomerang },
        (value) => {
          this.encodingProgress = value
        }
      ).run()

      const cleanup = () => {
        this.encoding = false
        this.encodingProgress = 0
        this.encodingExecution = null
      }

      this.encodingExecution.listen({
        onCancelled: cleanup,
        onRejected: cleanup,
        onResolved: (gif) => {
          cleanup()
          this.$store.commit('updateGif', gif)
          this.fillGIF()
          this.downloadReady = true

          if (document.hidden && ('Notification' in window) && Notification.permission === 'granted') {
            navigator.serviceWorker.ready.then((registration) => {
              registration.showNotification('You can now download your souvenir', {
                body: 'Thank you for your patience.',
                icon: appLogo
              })
            }).catch(console.error)
          }
        }
      })
    },
    cancelEncode () {
      if (this.encodingExecution) {
        this.encodingExecution.cancel()
      }
    }
  },
  created () {
    if (!this.capture) {
      this.$router.push({ name: 'home' })
    } else if (!this.gif) {
      this.startEncode()
    } else {
      this.fillGIF()
    }
  },
  unmounted () {
    this.emptyGIF()
  }
}
</script>
