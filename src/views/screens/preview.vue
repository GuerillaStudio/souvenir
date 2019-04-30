<template lang="html">
  <layout-default>
    <div class="download">
      <capture-options :disabled-time="true" :disabled-timer="true" :back-btn="back"></capture-options>

      <div class="preview">
        <preview-canvas v-if="capture" class="preview-visual"></preview-canvas>
      </div>

      <button class="download-btn btn btn--primary w100" @click="startEncoding">Generate GIF</button>
    </div>
  </layout-default>
</template>

<script>
import captureOptions from '/views/components/capture-options'
import previewCanvas from '/views/components/preview-canvas'

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
