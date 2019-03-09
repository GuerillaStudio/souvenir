<template lang="html">
  <div class="options">
    <select class="options__select" v-model="timer.selected" @change="updateTimer(timer.selected)" :disabled="encoding.status">
      <option v-for="time in timer.list" :key="time" :value="time">
        {{ timeLabel(time) }}
      </option>
    </select>
    <button class="options__btn" @click="back" :disabled="encoding.status"><icon-switch/>switch</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import iconSwitch from '@/icons/ico-switch'

export default {
  name: 'captureOptions',
  components: {
    iconSwitch
  },
  computed: {
    ...mapState([
      'timer',
      'encoding'
    ])
  },
  methods: {
    back () {
      this.$store.commit('welcome', false)
    },
    timeLabel (time) {
      return time + 's'
    },
    updateTimer (time) {
      this.$store.commit('updateTimer', time)
    }
  }
}
</script>
