<template>
  <div class="download">
    <div class="options">
      <span></span>
      <button class="options__btn" @click="back">← back</button>
    </div>

    <div class="preview">
      <img class="preview-visual" :src="downloading.objectUrl" alt="">
    </div>

    <a class="download-btn btn btn--primary w100" :href="downloading.objectUrl" :download="`souvenir${downloading.timestamp}.gif`">Download GIF</a>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'download',
  computed: {
    ...mapState([
      'downloading'
    ])
  },
  methods: {
    back () {
      this.$store.commit('stopDownloading')
    }
  }
}
</script>
