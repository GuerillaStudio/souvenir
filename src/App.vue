<template>
  <div class="layout">
    <welcome-screen v-if="!welcomed && !downloading.status"/>
    <capture-screen v-if="welcomed && !downloading.status"/>
    <download-screen v-if="downloading.status"/>
  </div>
</template>

<script>

import welcomeScreen from '@/views/welcome'
import captureScreen from '@/views/capture'
import downloadScreen from '@/views/download'

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
  }
}
</script>

<style src="@/assets/css/style.css" lang="css"></style>
