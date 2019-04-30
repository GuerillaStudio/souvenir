<template lang="html">
  <layout-default>
    <div class="welcome">
      <div class="welcome-about">
        <h1 class="welcome-title">Capture few seconds as a gif for souvenir</h1>
        <illu-welcome></illu-welcome>
        <ol class="welcome-steps">
          <li class="welcome-steps__item">Enable Camera</li>
          <li class="welcome-steps__item">Capture</li>
          <li class="welcome-steps__item">Save as a GIF</li>
        </ol>
      </div>
      <button class="btn btn--primary" @click="startCapture">Let's make a souvenir!</button>
    </div>
  </layout-default>
</template>

<script>
import illuWelcome from '/views/components/illu-welcome'

export default {
  name: 'welcome',
  components: {
    illuWelcome
  },
  methods: {
    startCapture () {
      this.$router.push({ name: 'capture' })
    }
  }
}
</script>
