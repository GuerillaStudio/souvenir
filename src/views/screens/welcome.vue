<template lang="html">
  <div class="welcome">
    <div class="welcome-about">
      <h1 class="welcome-title">Capture few seconds as a gif for souvenir</h1>
      <ol class="welcome-steps">
        <li class="welcome-steps__item">Enable Camera</li>
        <li class="welcome-steps__item">Capture</li>
        <li class="welcome-steps__item">Save as a GIF</li>
      </ol>
    </div>
    <button class="btn btn--primary" @click="welcome">Start Capturing</button>
  </div>
</template>

<script>
export default {
  name: 'welcome',
  methods: {
    welcome () {
      this.$store.dispatch('requestCamera')
    }
  }
}
</script>
