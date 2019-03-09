<template>
  <div class="capture">
    <capture-options/>

    <div class="preview">
      <video class="preview-visual" height="200px"></video>
    </div>

    <button class="capture-btn">Capture</button>

  </div>
</template>

<script>
import captureOptions from '@/components/capture-options'

export default {
  name: 'capture',
  components: {
    captureOptions
  }
}
</script>
