<template>
  <div class="capture-timer">{{ time }}</div>
</template>

<script>
export default {
  name: 'captureTimer',
  props: {
    time: {
      type: Number,
      required: true,
      default: 0
    }
  }
}
</script>
