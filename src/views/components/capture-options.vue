<template lang="html">
  <div class="options">
    <button v-if="backBtn" class="options__btn" @click="backBtn">← back</button>
    <select v-if="!disabledTime" v-model="selectedTime" class="options__select" @change="updateDuration(duration.selected)">
      <option v-for="time in duration.list" :key="time" :value="time">
        {{ timeLabel(time) }}
      </option>
    </select>
    <button class="options__btn" :class="{ 'options__btn--check': boomerang }" title="Boomerang mode" @click="openBoomerang">
      <icon-boomerang></icon-boomerang>
    </button>
    <div v-if="!disabledBoomerang" class="options__panel" :class="{ 'active': boomerangOpen }">
      <button class="option__panelOption" :class="{ 'current': !boomerang }" @click="updateBoomerang(false)"><icon-disabled></icon-disabled>Linear</button>
      <button class="option__panelOption" :class="{ 'current': boomerang }" @click="updateBoomerang(true)"><icon-boomerang></icon-boomerang>Boomerang</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import iconBoomerang from '/views/icons/ico-boomerang'
import iconDisabled from '/views/icons/ico-disabled'

export default {
  name: 'captureOptions',
  components: {
    iconBoomerang,
    iconDisabled
  },
  data () {
    return {
      boomerangOpen: false
    }
  },
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
    }
  },
  computed: {
    ...mapState([
      'duration',
      'boomerang'
    ]),
    selectedTime: {
      get: function () { return this.duration.selected },
      set: function (value) { this.$store.commit('updateDuration', value) }
    }
  },
  methods: {
    timeLabel (time) {
      return time + 's'
    },
    updateDuration (time) {
      this.$store.commit('updateDuration', time)
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
    }
  }
}
</script>
