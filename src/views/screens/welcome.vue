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
      <router-link class="btn btn--primary" :to="{ name: 'capture' }">Let's make a souvenir!</router-link>
    </div>
  </layout-default>
</template>

<script>
import illuWelcome from '~/src/views/components/illu-welcome.vue'

export default {
  name: 'welcome',
  components: {
    illuWelcome
  }
}
</script>
