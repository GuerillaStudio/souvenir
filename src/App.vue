<template lang="html">
  <div class="layout">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'souvenir',
  computed: {
    ...mapState([
      'welcomed',
      'downloading'
    ])
  },
  methods: {
    handleVisibilityChange (event) {
      if (document.hidden) {
        this.$store.commit('stopCamera')
      }
    }
  },
  mounted () {
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
  },
  destroyed () {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
  }
}
</script>

<style lang="css">
@import '/assets/css/style.css';
</style>
