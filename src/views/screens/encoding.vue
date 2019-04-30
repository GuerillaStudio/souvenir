<template lang="html">
  <div class="encoding">

    <div class="encoding-loader">
      <encoding-loader :percent="roundedPercentage" class="encoding-progress"></encoding-loader>
      <preview-canvas class="encoding-loader__preview"></preview-canvas>
    </div>
    <div class="encoding-percent">{{ roundedPercentage }}%</div>

    <div class="layoutOverlay-content">
      <div class="layoutOverlay-title">Almost ready~</div>
      <div class="layoutOverlay-subtitle">Encoding may take some time depending on your device</div>
    </div>

    <button class="encoding-notif">
      <icon-notif class="encoding-notif__icon"></icon-notif>
      <div>Get notified when It’s done</div>
    </button>
  </div>
</template>

<script>
import encodingLoader from '/views/components/encoding-loader'
import previewCanvas from '/views/components/preview-canvas'
import iconNotif from '/views/icons/ico-notif'

export default {
  name: 'encoding',
  components: {
    encodingLoader,
    previewCanvas,
    iconNotif
  },
  props: {
    value: Number
  },
  computed: {
    percentage () {
      return this.value * 100
    },
    roundedPercentage () {
      return Math.trunc(this.percentage)
    }
  }
}
</script>
