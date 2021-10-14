<template lang="html">
  <layout-default>
    <div class="previewPage">
      <capture-options :disabled-time="true" :disabled-timer="true" :back-btn="back"></capture-options>

      <div class="preview">
        <preview-canvas v-if="capture" class="preview-visual"></preview-canvas>
      </div>

      <button class="download-btn btn btn--primary w100" @click="startEncoding">Generate GIF</button>
    </div>
  </layout-default>
</template>

<script>
import captureOptions from '~/src/views/components/capture-options.vue'
import previewCanvas from '~/src/views/components/preview-canvas.vue'

import { mapState } from 'vuex'

export default {
  name: 'preview',
  components: {
    captureOptions,
    previewCanvas
  },
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
      this.$router.push({ name: 'download' })
    }
  },
  created () {
    if (!this.capture) {
      this.backHome()
    }
  }
}
</script>
