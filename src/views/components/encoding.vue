<template lang="html">
  <div class="encoding">
    <div class="encoding-illu">
      <img src="/assets/img/video-encoding.svg" alt="">
    </div>
    <div class="encoding-label">Encoding</div>
    <div class="encoding-progressBar">
      <div class="encoding-progressBar__state" :style="'width: ' + percentage + '%;'"></div>
    </div>
    <div class="encoding-percent">{{ roundedPercentage }}%</div>
  </div>
</template>

<script>
export default {
  name: 'encodingOverlay',
  props: {
    value: Number
  },
  computed: {
    percentage () {
      return this.value * 100
    },
    roundedPercentage () {
      return Math.round(this.percentage)
    }
  }
}
</script>
