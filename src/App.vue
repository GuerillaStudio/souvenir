<template>
  <div class="layout">
    <welcome-screen v-if="!welcomed"/>
    <capture-screen v-else/>
  </div>
</template>

<script>

import welcomeScreen from '@/views/welcome'
import captureScreen from '@/views/capture'

import { mapState } from 'vuex'

export default {
  name: 'souvenir',
  components: {
    welcomeScreen,
    captureScreen
  },
  computed: {
    ...mapState([
      'welcomed'
    ])
  }
}
</script>

<style src="@/assets/css/style.css" lang="css"></style>
