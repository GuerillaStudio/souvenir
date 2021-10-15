import store from '~/src/store'

export default () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    navigator.serviceWorker
      .register(new URL('~/src/service-worker.js', import.meta.url), { type: 'module' })
      .then(registration => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing

          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // At this point, the old content will have been purged and
                // the fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in your web app.
                console.log('New content is available; please refresh.')
                store.commit('updateRefreshBanner', true)
              } else {
                // At this point, everything has been precached.
                // It's the perfect time to display a
                // "Content is cached for offline use." message.
                console.log('Content is cached for offline use.')
              }
            }
          }
        }
      })
      .catch(error => console.error('Error during service worker registration:', error))
  }
}
