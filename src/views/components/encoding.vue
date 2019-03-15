<template lang="html">
  <div class="encoding">
    Encoding {{ ellipsis }}<br/>
    {{ encoding.progress }}%
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'encodingOverlay',
  data () {
    return {
      ellipsis: '',
      interval: null
    }
  },
  computed: {
    ...mapState([
      'encoding'
    ])
  },
  methods: {
    makeLoading () {
      // Dot loading
      this.interval = setInterval(() => {
        if (this.ellipsis.length < 3) {
          this.ellipsis += '.'
        } else {
          this.ellipsis = ''
        }
      }, 200)
    }
  },
  mounted: function () {
    this.makeLoading()
  },
  destroyed: function () {
    window.clearTimeout(this.interval)
  }
}
</script>
