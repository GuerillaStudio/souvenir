<template>
  <div class="download">
    <div class="options">
      <span></span>
      <button class="options__btn" @click="back">← back</button>
    </div>

    <div class="preview">
      <img class="preview-visual" src="https://unsplash.it/320/320" alt="">
    </div>

    <button class="download-btn btn btn--primary w100">Download GIF</button>
  </div>
</template>

<script>
export default {
  name: 'download',
  methods: {
    back () {
      this.$store.commit('stopDownloading')
    }
  }
}
</script>
