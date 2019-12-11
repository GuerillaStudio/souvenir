<template lang="html">
  <div class="souvenir">
    <div id="snow" class="snow"></div>
    <router-view></router-view>
    <refresh-banner></refresh-banner>
  </div>
</template>

<script>
/* eslint no-new: "off" */
/* eslint import/no-absolute-path: "off" */

import RefreshBanner from '/views/components/refresh'
import Snow from '/services/snow.js'

export default {
  name: 'souvenir',
  components: {
    RefreshBanner
  },
  data: () => ({
    snowInstance: null
  }),
  methods: {
    handleVisibilityChange (event) {
      if (document.hidden) {
        this.$store.commit('updateCamera', null)
      }
    },
    setupSnow () {
      this.snowInstance = new Snow('#snow', {
        number: 40,
        r: 3,
        v: 0.8
      })
    },
    resetSnow () {
      const snowContainer = document.querySelector('#snow')
      snowContainer.removeChild(snowContainer.querySelector('canvas'))
      this.snowInstance = null
    }
  },
  mounted () {
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
    document.addEventListener('DOMContentLoaded', () => {
      this.setupSnow()
    })
    window.addEventListener('resize', () => {
      this.resetSnow()
      this.setupSnow()
    })
  },
  destroyed () {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
  }
}
</script>

<style lang="css">
@import '/assets/css/style.css';
</style>
