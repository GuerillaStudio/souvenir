<template>
  <div class="refreshBanner" :class="{ 'active': needRefresh}">
    <div class="container">
      <div class="mb1">A new version of Souvenir is available</div>
      <button class="refreshBanner__btn" @click.prevent="reload">Refresh</button>
      <button class="refreshBanner__close" title="Fermer" @click.prevent="close"><icon-close></icon-close></button>
    </div>
  </div>
</template>

<script>
import IconClose from '/views/icons/ico-close'

import { mapState } from 'vuex'

export default {
  name: 'refreshBanner',
  components: {
    IconClose
  },
  computed: {
    ...mapState([
      'needRefresh'
    ])
  },
  methods: {
    reload () {
      location.reload(true)
    },
    close () {
      this.$store.commit('updateRefreshBanner', false)
    }
  }
}
</script>
