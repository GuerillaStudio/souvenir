<template lang="html">
  <div class="encoding">

    <div class="encoding-loader">
      <encoding-loader :percent="percentage" class="encoding-progress"></encoding-loader>
      <preview-canvas class="encoding-loader__preview"></preview-canvas>
    </div>
    <div class="encoding-percent">{{ percentage }}%</div>

    <div class="layoutOverlay-content">
      <div class="layoutOverlay-title">{{ labelTitle }}</div>
      <div class="layoutOverlay-subtitle">{{ labelSubtitle }}</div>
    </div>

    <button v-if="showNotificationButton" class="encoding-notif" @click="noticeMeSenpai">
      <icon-notif class="encoding-notif__icon"></icon-notif>
      <div>Get notified when It’s done</div>
    </button>
  </div>
</template>

<script>
import encodingLoader from '/views/components/encoding-loader'
import previewCanvas from '/views/components/preview-canvas'
import iconNotif from '/views/icons/ico-notif'

export default {
  name: 'encoding',
  components: {
    encodingLoader,
    previewCanvas,
    iconNotif
  },
  props: {
    value: Number
  },
  data: () => ({
    lastTitleUpdate: null,
    labelTitle: 'Encoding…',
    showNotificationButton: showNotificationButton()
  }),
  computed: {
    percentage () {
      return Math.trunc(this.value * 100)
    },
    labelSubtitle () {
      return Math.random() < 0.7 ? 'Encoding may take some time depending on your device' : 'Encoding may take some time depending on your level of cuteness'
    }
  },
  methods: {
    updateTitle () {
      const currentDate = Date.now()
      if (!this.lastTitleUpdate || (currentDate - this.lastTitleUpdate > 1000)) {
        this.lastTitleUpdate = currentDate
        switch (true) {
          case this.percentage < 25:
            this.labelTitle = 'Encoding…'
            break
          case this.percentage < 50:
            this.labelTitle = 'A little bit more'
            break
          case this.percentage < 75:
            this.labelTitle = 'One last touch'
            break
          case this.percentage >= 75:
            this.labelTitle = 'Almost ready ~'
            break
          default:
            this.labelTitle = 'Error'
            break
        }
      }
    },
    noticeMeSenpai () {
      Notification.requestPermission().then(() => {
        this.showNotificationButton = showNotificationButton()
      })
    }
  },
  watch: {
    percentage: function () {
      this.updateTitle()
    }
  }
}

function showNotificationButton () {
  return false

  // TODO: fuuuuuuuuuuuuu android, I don't want to spawn notifications from a fucking service worker :<

  // return ('Notification' in window) &&
  //   Notification.permission !== 'granted' &&
  //   Notification.permission !== 'denied'
}
</script>
