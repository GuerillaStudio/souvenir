<template lang="html">
  <div class="options">
    <button v-if="backBtn" class="options__btn" @click="backBtn">← back</button>
    <button v-if="!disabledTime" class="options__btn options__btn--select" title="Time" @click="openTime">
      {{ selectedTime }}s
    </button>
    <button v-if="!disabledTimer" class="options__btn" :class="{ 'options__btn--timer': timer }" :data-timer="timer" title="Timer settings" @click="openTimer">
      <icon-timer></icon-timer>
    </button>
    <button v-if="!disabledBoomerang" class="options__btn" :class="{ 'options__btn--check': boomerang }" title="Boomerang mode" @click="openBoomerang">
      <icon-boomerang></icon-boomerang>
    </button>
    <div v-if="!disabledBoomerang" class="options__panel" :class="{ 'active': boomerangOpen }">
      <button class="option__panelOption" :class="{ 'current': !boomerang }" @click="updateBoomerang(false)"><icon-disabled></icon-disabled>Linear</button>
      <button class="option__panelOption" :class="{ 'current': boomerang }" @click="updateBoomerang(true)"><icon-boomerang></icon-boomerang>Boomerang</button>
    </div>
    <div v-if="!disabledTimer" class="options__panel" :class="{ 'active': timerOpen }">
      <button class="option__panelOption option__panelOption--big" :class="{ 'current': timer === 0 }" @click="updateTimer(0)">0s</button>
      <button class="option__panelOption option__panelOption--big" :class="{ 'current': timer === 3 }" @click="updateTimer(3)">3s</button>
      <button class="option__panelOption option__panelOption--big" :class="{ 'current': timer === 10 }" @click="updateTimer(10)">10s</button>
    </div>
    <div v-if="!disabledTime" class="options__panel" :class="{ 'active': timeOpen }">
      <button
        v-for="time in duration.list"
        :key="time"
        class="option__panelOption option__panelOption--big"
        :class="{ 'current': time === selectedTime }"
        @click="updateDuration(time)"
      >{{ time }}s</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import iconBoomerang from '~/src/views/icons/ico-boomerang.vue'
import iconTimer from '~/src/views/icons/ico-timer.vue'
import iconDisabled from '~/src/views/icons/ico-disabled.vue'

export default {
  name: 'captureOptions',
  components: {
    iconBoomerang,
    iconTimer,
    iconDisabled
  },
  data: () => ({
    boomerangOpen: false,
    timeOpen: false,
    timerOpen: false
  }),
  props: {
    backBtn: {
      type: Function,
      default: null
    },
    disabledTime: {
      type: Boolean,
      default: false
    },
    disabledBoomerang: {
      type: Boolean,
      default: false
    },
    disabledTimer: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState([
      'duration',
      'boomerang',
      'timer'
    ]),
    selectedTime: {
      get: function () { return this.duration.selected },
      set: function (value) { this.$store.commit('updateDuration', value) }
    }
  },
  methods: {
    updateDuration (time) {
      this.$store.commit('updateDuration', time)
      this.closeTime()
    },
    openTime () {
      this.timeOpen = true
    },
    closeTime () {
      this.timeOpen = false
    },
    openBoomerang () {
      this.boomerangOpen = true
    },
    closeBoomerang () {
      this.boomerangOpen = false
    },
    updateBoomerang (value) {
      this.$store.commit('updateBoomerang', value)
      this.closeBoomerang()
    },
    openTimer () {
      this.timerOpen = true
    },
    closeTimer () {
      this.timerOpen = false
    },
    updateTimer (value) {
      this.$store.commit('updateTimer', value)
      this.closeTimer()
    }
  }
}
</script>
