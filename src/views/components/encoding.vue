<template lang="html">
  <div class="encoding">
    <div class="encoding-illu">
      <img src="/assets/img/video-encoding.svg" alt="">
    </div>
    <div class="encoding-label">Encoding</div>
    <div class="encoding-progressBar">
      <div class="encoding-progressBar__state" :style="'width: ' + encoding.state + '%;'"></div>
    </div>
    <div class="encoding-percent">{{ encoding.state }}%</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'encodingOverlay',
  computed: {
    ...mapState([
      'encoding'
    ])
  }
}
</script>
