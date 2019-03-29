import { write } from '/services/encode-core.js'

onmessage = handleMessage

async function handleMessage (event) {
  const { imageWidth, imageHeight, delayTime, indexedColorImages, boomerangEffect } = event.data

  const writing = write(imageWidth, imageHeight, delayTime, indexedColorImages, boomerangEffect)

  writing.on('progress', value => postMessage({
    type: 'progress',
    payload: {
      value
    }
  }))

  writing.once('done', buffer => postMessage({
    type: 'done',
    payload: {
      buffer
    }
  }))
}
