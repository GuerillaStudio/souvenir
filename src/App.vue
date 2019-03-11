<template lang="html">
  <div class="layout">
    <welcome-screen v-if="!mediaStream && !downloading.status"></welcome-screen>
    <capture-screen v-if="mediaStream && !downloading.status"></capture-screen>
    <download-screen v-if="downloading.status"></download-screen>
  </div>
</template>

<script>

import welcomeScreen from '/views/welcome'
import captureScreen from '/views/capture'
import downloadScreen from '/views/download'

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
      'mediaStream',
      'downloading'
    ])
  }
}
</script>

<style lang="css">
@import '/assets/css/style.css';
</style>
