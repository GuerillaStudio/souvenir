<template>
  <div class="layoutOverlay">
    <button v-if="close" class="layoutOverlay-close" aria-label="Close" @click="close">
      <icon-close></icon-close>
    </button>
    <slot></slot>
  </div>
</template>

<script>
import iconClose from '~/src/views/icons/ico-close-overlay.vue'

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
  unmounted: function () {
    document.body.classList.remove('layoutOverlay-body')
  }
}
</script>
