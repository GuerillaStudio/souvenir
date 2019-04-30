<template lang="html">
  <layout-default>
    <div class="download">
      <div class="options">
        <span></span>
        <button class="options__btn" @click="back">← back</button>
      </div>

      <div class="preview preview--novideo">
        <img class="preview-visualImg" :src="objectUrl" alt="">
      </div>

      <a class="download-btn btn btn--primary w100" :href="objectUrl" :download="`souvenir${timestamp}.gif`">Download GIF</a>
    </div>
  </layout-default>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'download',
  data: () => ({
    objectUrl: null
  }),
  computed: {
    ...mapState([
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
      this.$router.push({ name: 'capture' })
    }
  },
  created () {
    if (!this.gif) {
      this.$router.push({ name: 'home' })
    } else {
      this.objectUrl = URL.createObjectURL(this.gif.blob)
    }
  },
  destroyed () {
    URL.revokeObjectURL(this.objectUrl)
  }
}
</script>
