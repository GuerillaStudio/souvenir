<template lang="html">
  <div class="options">
    <select v-model="timer.selected" class="options__select" :disabled="encoding.status" @change="updateTimer(timer.selected)">
      <option v-for="time in timer.list" :key="time" :value="time">
        {{ timeLabel(time) }}
      </option>
    </select>
    <button class="options__btn" :disabled="encoding.status" @click="back"><icon-switch></icon-switch>switch</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import iconSwitch from '/views/icons/ico-switch'

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
      this.$store.commit('updateMediaStream', null)
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
