<template lang="html">
  <div class="options">
    <select v-model="timer.selected" class="options__select" @change="updateTimer(timer.selected)">
      <option v-for="time in timer.list" :key="time" :value="time">
        {{ timeLabel(time) }}
      </option>
    </select>
    <button class="options__btn" @click="switchCamera"><icon-switch></icon-switch>switch</button>
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
      'timer'
    ])
  },
  methods: {
    switchCamera () {
      this.$store.dispatch('requestCamera', true)
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
