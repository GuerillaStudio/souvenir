<template>
  <svg width="142" height="142" viewBox="0 0 142 142" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="71" cy="71" r="69" stroke="#fff" stroke-opacity=".2" stroke-width="4" stroke-miterlimit="3.864" stroke-linecap="round" stroke-linejoin="round"/>
    <path :stroke-dasharray="progressPerimeter" :stroke-dashoffset="pathDashOffset" class="encoding-progress__value" d="m 72.239,2.011 c 37.9809,0.6782829 68.26967,31.931708 67.75989,69.895071 C 139.48913,109.8675 108.37484,140.24197 70.395213,139.90478 32.415584,139.56759 1.8454901,108.64548 2.0098165,70.680986 2.1741514,32.714556 33.013046,2.0038306 71,2" stroke="url(#paint0_linear)" stroke-width="4" stroke-miterlimit="3.864" stroke-linecap="round" stroke-linejoin="round"/>
    <defs>
      <linearGradient id="paint0_linear" x1="4" y1="4" x2="71" y2="138" gradientUnits="userSpaceOnUse">
        <stop stop-color="#DD28D3"/>
        <stop offset="1" stop-color="#8420A7"/>
      </linearGradient>
    </defs>
  </svg>
</template>

<script>
export default {
  name: 'encodingLoader',
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    progressPerimeter: 432.3168640136719
  }),
  computed: {
    pathDashOffset () {
      if (this.percent) {
        const to = this.progressPerimeter * ((100 - this.percent) / 100)
        return Math.max(0, to) // Prevent negative number
      }
      return this.progressPerimeter
    }
  }
}
</script>
