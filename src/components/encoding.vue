<template>
  <div class="encoding">
    Encoding {{ ellipsis }}
  </div>
</template>

<script>
export default {
  name: 'encodingOverlay',
  data () {
    return {
      ellipsis: '',
      interval: null
    }
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
