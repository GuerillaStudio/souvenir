<template lang="html">
  <div class="layout">
    <welcome-screen v-if="!welcomed && !downloading.status"></welcome-screen>
    <capture-screen v-if="welcomed && !downloading.status"></capture-screen>
    <download-screen v-if="downloading.status"></download-screen>
  </div>
</template>

<script>

import welcomeScreen from '/views/screens/welcome'
import captureScreen from '/views/screens/capture'
import downloadScreen from '/views/screens/download'

import { mapState } from 'vuex'

export default {
  name: 'souvenir',
  components: {
    welcomeScreen,
    captureScreen,
    downloadScreen
  },
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
      } else {
        if (this.welcomed) {
          this.$store.dispatch('requestCamera', false)
        }
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
