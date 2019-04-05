<template lang="html">
  <div class="progressBar">
    <div class="progressBar__state" :style="'width: ' + percentage + '%;'"></div>
  </div>
</template>

<script>
export default {
  name: 'progressBar',
  props: {
    value: Number
  },
  computed: {
    percentage () {
      return this.value * 100
    }
  }
}
</script>
