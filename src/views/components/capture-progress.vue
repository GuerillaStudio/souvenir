<template lang="html">
  <div class="progressBar">
    <div class="progressBar__state" :style="'width: ' + capturing.state + '%;'"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'progressBar',
  computed: {
    ...mapState([
      'capturing'
    ])
  }
}
</script>
