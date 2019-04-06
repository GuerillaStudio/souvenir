<template lang="html">
  <div class="layout">
    <router-view></router-view>
    <refresh-banner></refresh-banner>
  </div>
</template>

<script>
import RefreshBanner from '/views/components/refresh'

export default {
  name: 'souvenir',
  components: {
    RefreshBanner
  },
  methods: {
    handleVisibilityChange (event) {
      if (document.hidden) {
        this.$store.commit('updateCamera', null)
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
