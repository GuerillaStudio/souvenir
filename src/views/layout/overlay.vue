<template>
  <div class="layoutOverlay">
    <button v-if="close" class="layoutOverlay-close" aria-label="Close" @click="close">
      <icon-close></icon-close>
    </button>
    <slot></slot>
  </div>
</template>

<script>
import iconClose from '/views/icons/ico-close-overlay'

export default {
  components: {
    iconClose
  },
  props: {
    close: {
      type: Function,
      required: false
    }
  },
  mounted: function () {
    document.body.classList.add('layoutOverlay-body')
  },
  destroyed: function () {
    document.body.classList.remove('layoutOverlay-body')
  }
}
</script>
