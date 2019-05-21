import { write } from '/services/write-gif.js'

const postProgressMessage = value => postMessage({ type: 'progress', payload: { value } })
const postDoneMessage = buffer => postMessage({ type: 'done', payload: { buffer } })

onmessage = event => {
  const { imageWidth, imageHeight, delayTime, indexedColorImages, boomerangEffect } = event.data

  const buffer = write(
    imageWidth,
    imageHeight,
    delayTime,
    indexedColorImages,
    boomerangEffect,
    postProgressMessage
  )

  postDoneMessage(buffer)
}
